'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

export const AnimatedHeroContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. SplitText animation for Hero Headline
        if (titleRef.current) {
          const split = new SplitText(titleRef.current, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'hero-split-line',
            autoSplit: true,
          });

          gsap.fromTo(
            split.lines,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power2.out',
            }
          );
        }

        // 2. Entrance for Trust Pill, Subtitle, CTAs, and Popular Chips
        // NOTE: The search bar (.searchWidget) and Hero background image are EXPLICITLY NOT ANIMATED.
        gsap.fromTo(
          '.gsap-hero-anim',
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`container ${styles.heroContent}`}>
      {/* Trust Pill */}
      <div className={`${styles.trustPill} gsap-hero-anim`}>
        <span className={styles.pulseDot} />
        <span>OVER 10,000+ CURATED INDIAN JOURNEYS CRAFTED</span>
      </div>

      {/* Hero Headline with SplitText and accessibility aria-label */}
      <h1
        ref={titleRef}
        className={styles.heroTitle}
        aria-label="Crafting Unforgettable Domestic Journeys"
      >
        Crafting Unforgettable <br />
        <span className={styles.highlightText}>Domestic Journeys</span>
      </h1>

      <p className={`${styles.heroSubtitle} gsap-hero-anim`}>
        From the misty valleys of Kanchenjunga to azure Andaman lagoons. Personalized domestic
        tours across India with transparent quotes and 24x7 trip marshals.
      </p>

      {/* Quick CTA Actions */}
      <div className={`${styles.heroActions} gsap-hero-anim`}>
        <Link href="/packages" className={styles.primaryCtaBtn}>
          Explore All Packages
        </Link>
        <a href="#honeymoon" className={styles.secondaryCtaBtn}>
          Honeymoon Specials
        </a>
        <a href="#family" className={styles.secondaryCtaBtn}>
          Family &amp; Group Trips
        </a>
      </div>

      {/* Tabbed Search Bar (EXPLICITLY NOT ANIMATED per requirements) */}
      <div className={styles.searchWidget}>
        <div className={styles.searchFields}>
          <div className={styles.searchField}>
            <span className={styles.searchLabel}>WHERE TO?</span>
            <input
              type="text"
              placeholder="e.g. Sikkim, Andaman, Kashmir..."
              className={styles.searchInput}
              readOnly
            />
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <span className={styles.searchLabel}>TRAVEL STYLE</span>
            <div className={styles.searchSelectSimulated}>Honeymoon / Group / Family</div>
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <span className={styles.searchLabel}>BUDGET</span>
            <div className={styles.searchSelectSimulated}>From ₹11,300 / person</div>
          </div>
        </div>

        <Link href="/packages" className={styles.searchSubmitBtn}>
          Search Packages
        </Link>
      </div>

      {/* Popular Destination Chips */}
      <div className={`${styles.popularChips} gsap-hero-anim`}>
        <span className={styles.popularLabel}>POPULAR:</span>
        <Link href="/packages/sikkim-darjeeling" className={styles.popularChip}>
          Sikkim-Darjeeling
        </Link>
        <Link href="/packages/andaman-4n-5d" className={styles.popularChip}>
          Andaman Islands
        </Link>
        <Link href="/packages/kashmir-couple-special" className={styles.popularChip}>
          Kashmir Couple
        </Link>
        <Link href="/packages/lakshadweep" className={styles.popularChip}>
          Lakshadweep
        </Link>
        <Link href="/packages/assam-meghalaya" className={styles.popularChip}>
          Assam-Meghalaya
        </Link>
      </div>
    </div>
  );
};
