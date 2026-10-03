'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DestinationIcons } from '@/components/icons/destinations';
import styles from './AnimatedHeroContent.module.css';

const TABS = [
  { id: 'explore', label: 'Explore', slug: '', trending: false },
  { id: 'rajasthan', label: 'Rajasthan', slug: 'rajasthan', trending: true },
  { id: 'kerala', label: 'Kerala', slug: 'kerala', trending: false },
  { id: 'ladakh', label: 'Ladakh', slug: 'ladakh', trending: true },
  { id: 'kashmir', label: 'Kashmir', slug: 'kashmir', trending: false },
  { id: 'himachal', label: 'Himachal', slug: 'himachal', trending: false },
  { id: 'goa', label: 'Goa', slug: 'goa', trending: false },
  { id: 'andaman', label: 'Andaman', slug: 'andaman', trending: false },
  { id: 'northeast', label: 'North East', slug: 'north-east', trending: false },
  { id: 'uttarakhand', label: 'Uttarakhand', slug: 'uttarakhand', trending: false },
  { id: 'bali', label: 'Bali', slug: 'bali', trending: true },
  { id: 'dubai', label: 'Dubai', slug: 'dubai', trending: false },
  { id: 'thailand', label: 'Thailand', slug: 'thailand', trending: false },
];

export const DestinationTabStrip: React.FC = () => {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const getIsActive = (slug: string) => {
    if (slug === '') return pathname === '/packages';
    return pathname === `/packages/${slug}`;
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
    }
  };

  const scrollBy = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -(clientWidth * 0.7) : (clientWidth * 0.7),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll active tab into view when active changes
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [pathname]);

  return (
    <div className={styles.tabStripWrapper}>
      <div className={styles.tabStripContainer}>
        {showLeftArrow && (
          <div className={`${styles.scrollArrowWrapper} ${styles.scrollArrowLeft}`}>
            <button 
              className={styles.scrollBtn} 
              onClick={() => scrollBy('left')} 
              aria-label="Scroll tabs left"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}
        
        <div 
          className={styles.tabScrollArea} 
          ref={scrollRef} 
          onScroll={handleScroll}
          role="tablist"
        >
          {TABS.map(tab => {
            const Icon = DestinationIcons[tab.id];
            const isActive = getIsActive(tab.slug);
            return (
              <Link 
                href={`/packages${tab.slug ? `/${tab.slug}` : ''}`}
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
                ref={isActive ? activeTabRef : null}
              >
                <div className={styles.iconWrapper}>
                  {tab.trending && <span className={styles.trendingBadge}>Trending</span>}
                  {Icon && <Icon size={28} />}
                </div>
                <span className={styles.tabLabel}>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {showRightArrow && (
          <div className={`${styles.scrollArrowWrapper} ${styles.scrollArrowRight}`}>
            <button 
              className={styles.scrollBtn} 
              onClick={() => scrollBy('right')} 
              aria-label="Scroll tabs right"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
