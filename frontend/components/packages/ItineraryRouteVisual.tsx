'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './ItineraryRouteVisual.module.css';
import { ItineraryDay } from '@/lib/types';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const DEBUG = false;

interface ItineraryRouteVisualProps {
  itinerary: ItineraryDay[];
  openDays: number[];
  onToggleDay: (dayNum: number) => void;
  onToggleAllDays: () => void;
}

interface PathMetrics {
  startX: number;
  startY: number;
  endY: number;
  lastMarkerToBottom: number;
  measuredHeight: number;
  railWidth: number;
  pathD: string;
}

export const ItineraryRouteVisual: React.FC<ItineraryRouteVisualProps> = ({
  itinerary,
  openDays,
  onToggleDay,
  onToggleAllDays,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineWrapperRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);

  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [metrics, setMetrics] = useState<PathMetrics>({
    startX: 28,
    startY: 27,
    endY: 300,
    lastMarkerToBottom: 40,
    measuredHeight: 400,
    railWidth: 56,
    pathD: '',
  });

  const getActiveY = useCallback(() => {
    if (typeof window === 'undefined') return 300;
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.round(window.innerHeight * 0.4) : Math.round(window.innerHeight * 0.5);
  }, []);

  const measureAndBuildPath = useCallback(() => {
    if (!timelineWrapperRef.current) return;

    const wrapperEl = timelineWrapperRef.current;
    const wrapperRect = wrapperEl.getBoundingClientRect();

    const validMarkers = markerRefs.current.filter((m): m is HTMLDivElement => m !== null);
    if (validMarkers.length === 0) return;

    const firstMarker = validMarkers[0];
    const lastMarker = validMarkers[validMarkers.length - 1];

    const firstRect = firstMarker.getBoundingClientRect();
    const lastRect = lastMarker.getBoundingClientRect();

    const isMobile = window.innerWidth < 768;
    const railWidth = isMobile ? 36 : 56;

    const startX = (firstRect.left + firstRect.right) / 2 - wrapperRect.left;
    const startY = (firstRect.top + firstRect.bottom) / 2 - wrapperRect.top;
    const endY = (lastRect.top + lastRect.bottom) / 2 - wrapperRect.top;
    const totalHeight = Math.max(wrapperRect.height, endY + 20);

    const pathString = `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${startX.toFixed(1)} ${endY.toFixed(1)}`;

    setMetrics({
      startX,
      startY,
      endY,
      lastMarkerToBottom: totalHeight - endY,
      measuredHeight: totalHeight,
      railWidth,
      pathD: pathString,
    });
  }, []);

  // Set up GSAP DrawSVG scrub line and per-marker ScrollTriggers using ONE ACTIVE_Y
  useGSAP(
    () => {
      if (!timelineWrapperRef.current || !activePathRef.current || !metrics.pathD) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const activeY = getActiveY();

      if (isReducedMotion) {
        gsap.set(activePathRef.current, { drawSVG: '100%' });
        markerRefs.current.forEach((m) => {
          if (m) {
            m.classList.add(styles.isMarkerDone);
            m.classList.remove(styles.isMarkerActive);
          }
        });
        cardRefs.current.forEach((c) => {
          c?.classList.remove(styles.isCardActive);
        });
        return;
      }

      // Initial SVG line state
      gsap.set(activePathRef.current, { drawSVG: '0%' });

      // Single ScrollTrigger scrub line
      const lineTrigger = ScrollTrigger.create({
        trigger: timelineWrapperRef.current,
        start: () => `top+=${metrics.startY} ${activeY}px`,
        end: () => `bottom-=${metrics.lastMarkerToBottom} ${activeY}px`,
        scrub: true,
        invalidateOnRefresh: true,
        animation: gsap.fromTo(
          activePathRef.current,
          { drawSVG: '0%' },
          { drawSVG: '100%', ease: 'none' }
        ),
      });

      // Synchronize active and done states for markers & cards at ACTIVE_Y
      const updateActiveStates = () => {
        const currentActiveY = getActiveY();
        let activeIndex = -1;

        markerRefs.current.forEach((markerEl, idx) => {
          if (!markerEl) return;
          const rect = markerEl.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          if (centerY <= currentActiveY) {
            activeIndex = idx;
          }
        });

        markerRefs.current.forEach((m, idx) => {
          const c = cardRefs.current[idx];
          if (!m) return;

          if (idx === activeIndex) {
            m.classList.add(styles.isMarkerActive);
            m.classList.remove(styles.isMarkerDone);
            c?.classList.add(styles.isCardActive);
          } else if (idx < activeIndex) {
            m.classList.remove(styles.isMarkerActive);
            m.classList.add(styles.isMarkerDone);
            c?.classList.remove(styles.isCardActive);
          } else {
            m.classList.remove(styles.isMarkerActive);
            m.classList.remove(styles.isMarkerDone);
            c?.classList.remove(styles.isCardActive);
          }
        });
      };

      // Individual marker/card triggers using the exact same ACTIVE_Y reference line
      const markerTriggers: ScrollTrigger[] = [];

      markerRefs.current.forEach((markerEl, idx) => {
        if (!markerEl) return;
        const nextMarker = markerRefs.current[idx + 1];

        const st = ScrollTrigger.create({
          trigger: markerEl,
          start: () => `top ${activeY}px`,
          end: () => (nextMarker ? `top ${activeY}px` : `bottom ${activeY}px`),
          endTrigger: nextMarker || timelineWrapperRef.current,
          invalidateOnRefresh: true,
          onToggle: updateActiveStates,
          onRefresh: updateActiveStates,
        });
        markerTriggers.push(st);
      });

      updateActiveStates();

      return () => {
        lineTrigger.kill();
        markerTriggers.forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [metrics, itinerary] }
  );

  // Measure and re-refresh on resize, fonts, images, tab mount, and accordion toggle
  useEffect(() => {
    measureAndBuildPath();

    const handleRefresh = () => {
      measureAndBuildPath();
      ScrollTrigger.refresh();
    };

    // 1. ResizeObserver for measuring relative container dimensions
    let observer: ResizeObserver | null = null;
    if (timelineWrapperRef.current) {
      observer = new ResizeObserver(() => {
        handleRefresh();
      });
      observer.observe(timelineWrapperRef.current);
    }

    // 2. Window resize event
    window.addEventListener('resize', handleRefresh);

    // 3. Fonts ready event
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    // 4. Card image load event listeners
    const imgs = timelineWrapperRef.current?.querySelectorAll('img');
    imgs?.forEach((img) => img.addEventListener('load', handleRefresh));

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', handleRefresh);
      imgs?.forEach((img) => img.removeEventListener('load', handleRefresh));
    };
  }, [measureAndBuildPath, itinerary]);

  // Recalculate and refresh when accordion days expand or collapse
  useEffect(() => {
    const timer = setTimeout(() => {
      measureAndBuildPath();
      ScrollTrigger.refresh();
    }, 60);
    return () => clearTimeout(timer);
  }, [openDays, measureAndBuildPath]);

  const activeY = getActiveY();

  return (
    <div ref={containerRef} className={styles.itinerarySection}>
      {/* Temporary Debug Line at ACTIVE_Y if DEBUG flag is enabled */}
      {DEBUG && (
        <div
          style={{
            position: 'fixed',
            top: `${activeY}px`,
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'red',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header with expand/collapse control */}
      <div className={styles.itineraryHeader}>
        <h3 className={styles.blockTitle}>Day-by-Day Itinerary &amp; Route Visual</h3>
        <button type="button" onClick={onToggleAllDays} className={styles.toggleAllBtn}>
          {openDays.length === itinerary.length ? 'COLLAPSE ALL' : 'EXPAND ALL'}
        </button>
      </div>

      {/* Timeline Layout */}
      <div ref={timelineWrapperRef} className={styles.timelineWrapper}>
        {/* SVG Route Line in Left Rail */}
        <svg
          className={styles.lineSvg}
          style={{
            width: `${metrics.railWidth}px`,
            height: `${metrics.measuredHeight}px`,
          }}
          viewBox={`0 0 ${metrics.railWidth} ${metrics.measuredHeight}`}
        >
          {metrics.pathD && (
            <>
              {/* Background guide line */}
              <path
                d={metrics.pathD}
                className={styles.bgPath}
                vectorEffect="non-scaling-stroke"
              />
              {/* Active #FF5722 line drawn by DrawSVG */}
              <path
                ref={activePathRef}
                d={metrics.pathD}
                className={styles.activePath}
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        {/* Day Rows */}
        <div className={styles.dayList}>
          {itinerary.map((dayPlan, idx) => {
            const isOpen = openDays.includes(dayPlan.day);
            return (
              <div key={dayPlan.day} className={styles.dayRow}>
                {/* Fixed-width left rail containing real DOM marker */}
                <div className={styles.leftRail}>
                  <div
                    ref={(el) => {
                      markerRefs.current[idx] = el;
                    }}
                    className={`${styles.markerDom} ${DEBUG ? styles.debugMarker : ''}`}
                    onClick={() => onToggleDay(dayPlan.day)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Day ${dayPlan.day} marker`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleDay(dayPlan.day);
                      }
                    }}
                  >
                    <span className={styles.markerText}>{dayPlan.day}</span>
                  </div>
                </div>

                {/* Day Card */}
                <div
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`${styles.itineraryDayCard} ${DEBUG ? styles.debugCard : ''}`}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

