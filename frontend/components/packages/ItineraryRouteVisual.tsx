'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './ItineraryRouteVisual.module.css';
import { ItineraryDay } from '@/lib/types';
import { gsap, ScrollTrigger, DrawSVGPlugin, useGSAP } from '@/lib/gsap';

interface ItineraryRouteVisualProps {
  itinerary: ItineraryDay[];
  openDays: number[];
  onToggleDay: (dayNum: number) => void;
  onToggleAllDays: () => void;
}

export const ItineraryRouteVisual: React.FC<ItineraryRouteVisualProps> = ({
  itinerary,
  openDays,
  onToggleDay,
  onToggleAllDays,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [markerYPositions, setMarkerYPositions] = useState<number[]>([]);
  const [svgHeight, setSvgHeight] = useState<number>(600);

  // Measure card Y positions to position SVG markers accurately aligned with each day card
  useEffect(() => {
    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const cards = container.querySelectorAll<HTMLElement>(`.${styles.itineraryDayCard}`);
      if (!cards || cards.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const positions: number[] = [];

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        // Calculate center Y of header relative to SVG container top
        const relativeY = cardRect.top - containerRect.top + 28;
        positions.push(relativeY);
      });

      setMarkerYPositions(positions);
      const totalH = cards[cards.length - 1].getBoundingClientRect().bottom - containerRect.top;
      setSvgHeight(Math.max(totalH, 400));
    };

    updatePositions();

    // Re-measure when window resizes or accordion days open/close
    window.addEventListener('resize', updatePositions);
    const timeout = setTimeout(updatePositions, 150);

    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timeout);
    };
  }, [itinerary, openDays]);

  // Construct SVG Path string connecting all marker Y positions
  const pathD = React.useMemo(() => {
    if (markerYPositions.length === 0) return 'M 24 20 L 24 600';
    const startY = markerYPositions[0];
    const endY = markerYPositions[markerYPositions.length - 1];
    return `M 24 ${startY} L 24 ${endY}`;
  }, [markerYPositions]);

  // GSAP ScrollTrigger Scrub + DrawSVGPlugin animation
  useGSAP(
    () => {
      if (!pathRef.current || markerYPositions.length === 0) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReducedMotion) {
        // Show full path and all markers statically for reduced motion
        gsap.set(pathRef.current, { drawSVG: '100%' });
        gsap.set('.route-marker-node', { scale: 1, opacity: 1 });
      } else {
        // Initial hidden state set in JS
        gsap.set(pathRef.current, { drawSVG: '0%' });
        gsap.set('.route-marker-node', { scale: 0.6, opacity: 0.4 });

        // ScrollTrigger timeline scrubbed to user scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.5,
          },
        });

        // 1. Progressively draw the #FF5722 path
        tl.fromTo(
          pathRef.current,
          { drawSVG: '0%' },
          { drawSVG: '100%', ease: 'none', duration: 1 }
        );

        // 2. Pop each marker node and highlight corresponding day card when line reaches it
        const markers = containerRef.current?.querySelectorAll('.route-marker-node');
        const cards = containerRef.current?.querySelectorAll(`.${styles.itineraryDayCard}`);

        if (markers && markers.length > 0) {
          markers.forEach((marker, idx) => {
            const card = cards?.[idx];
            const progress = idx / (markers.length - 1 || 1);

            // Pop marker node
            tl.to(
              marker,
              {
                scale: 1,
                opacity: 1,
                duration: 0.1,
                ease: 'back.out(1.7)',
              },
              progress * 0.95
            );

            // Highlight day card
            if (card) {
              tl.to(
                card,
                {
                  borderColor: '#FF5722',
                  boxShadow: '0 4px 18px rgba(255, 87, 34, 0.18)',
                  duration: 0.1,
                },
                progress * 0.95
              );
            }
          });
        }
      }
    },
    { scope: containerRef, dependencies: [markerYPositions, itinerary] }
  );

  return (
    <div ref={containerRef} className={styles.itinerarySection}>
      {/* Header with expand/collapse control */}
      <div className={styles.itineraryHeader}>
        <h3 className={styles.blockTitle}>Day-by-Day Itinerary &amp; Route Visual</h3>
        <button type="button" onClick={onToggleAllDays} className={styles.toggleAllBtn}>
          {openDays.length === itinerary.length ? 'COLLAPSE ALL' : 'EXPAND ALL'}
        </button>
      </div>

      {/* Timeline Layout */}
      <div className={styles.timelineWrapper}>
        {/* Left Vertical SVG Route Axis */}
        <div className={styles.svgTrackContainer}>
          <svg className={styles.timelineSvg} style={{ height: `${svgHeight}px` }}>
            {/* Background dashed guide line */}
            <path d={pathD} className={styles.backgroundLine} />

            {/* Active progressive #FF5722 line drawn by DrawSVGPlugin */}
            <path ref={pathRef} d={pathD} className={styles.activePath} />

            {/* Marker Nodes for Day 1 to Day N */}
            {itinerary.map((dayItem, idx) => {
              const yPos = markerYPositions[idx] || 40 + idx * 80;
              const isOpen = openDays.includes(dayItem.day);

              return (
                <g
                  key={dayItem.day}
                  className={`${styles.markerGroup} route-marker-node`}
                  transform={`translate(24, ${yPos})`}
                  onClick={() => onToggleDay(dayItem.day)}
                  role="button"
                  aria-label={`Toggle Day ${dayItem.day}`}
                >
                  <circle r="16" className={isOpen ? styles.markerActiveCircle : styles.markerOuterCircle} />
                  <text className={styles.markerText}>{dayItem.day}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Day Cards List */}
        <div className={styles.cardsList}>
          {itinerary.map((dayPlan) => {
            const isOpen = openDays.includes(dayPlan.day);
            return (
              <div
                key={dayPlan.day}
                className={`${styles.itineraryDayCard} ${
                  isOpen ? styles.itineraryDayCardActive : ''
                }`}
              >
                <div
                  className={styles.dayCardHeader}
                  onClick={() => onToggleDay(dayPlan.day)}
                >
                  <div className={styles.dayTitleGroup}>
                    <span className={styles.dayBadge}>DAY {dayPlan.day}</span>
                    <h4 className={styles.dayTitle}>{dayPlan.title}</h4>
                  </div>
                  <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                  <div className={styles.dayCardBody}>
                    <div className={styles.dayMetaRow}>
                      {dayPlan.stay && (
                        <span className={styles.dayMetaChip}>🏨 Stay: {dayPlan.stay}</span>
                      )}
                      {dayPlan.meals && (
                        <span className={styles.dayMetaChip}>🍽️ Meals: {dayPlan.meals}</span>
                      )}
                      {dayPlan.altitude && (
                        <span className={styles.dayMetaChip}>⛰️ Altitude: {dayPlan.altitude}</span>
                      )}
                    </div>

                    <p className={styles.dayDescription}>{dayPlan.description}</p>

                    {dayPlan.highlights && dayPlan.highlights.length > 0 && (
                      <div className={styles.dayHighlightsPills}>
                        {dayPlan.highlights.map((h: string, i: number) => (
                          <span key={i} className={styles.dayHighlightPill}>
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
