'use client';

import React from 'react';
import styles from './ReviewScoreCard.module.css';

interface Props {
  ratingAvg: number;
  reviewCount: number;
  onWriteReviewClick: () => void;
  selectedStarFilter?: number | null;
  onSelectStarFilter?: (star: number | null) => void;
}

export const ReviewScoreCard: React.FC<Props> = ({
  ratingAvg,
  reviewCount,
  onWriteReviewClick,
  selectedStarFilter,
  onSelectStarFilter,
}) => {
  // Approximate standard distribution for display
  const distribution = [
    { stars: 5, pct: 86 },
    { stars: 4, pct: 11 },
    { stars: 3, pct: 2 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 0 },
  ];

  const handleRowClick = (stars: number) => {
    if (!onSelectStarFilter) return;
    if (selectedStarFilter === stars) {
      onSelectStarFilter(null); // toggle off
    } else {
      onSelectStarFilter(stars);
    }
  };

  return (
    <div className={styles.summaryCard}>
      {/* 1. Left Score */}
      <div className={styles.scoreBlock}>
        <div className={styles.scoreNumberRow}>
          <span className={styles.bigScore}>{ratingAvg.toFixed(1)}</span>
          <span className={styles.outOf}>/ 5.0</span>
        </div>

        <div className={styles.starsRow}>★★★★★</div>

        <span className={styles.verifiedBasedOn}>Based on {reviewCount} verified travelers</span>

        <div className={styles.recommendationBadge}>
          <span>✓</span> 98% of guests recommend this tour
        </div>
      </div>

      {/* 2. Middle Rating Bars */}
      <div className={styles.barsBlock}>
        {distribution.map(({ stars, pct }) => {
          const isSelected = selectedStarFilter === stars;
          return (
            <div
              key={stars}
              className={`${styles.barRow} ${isSelected ? styles.activeBarRow : ''}`}
              onClick={() => handleRowClick(stars)}
              title={`Filter by ${stars} stars`}
            >
              <div className={styles.starTierLabel}>
                {stars} <span>★</span>
              </div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.barPercentage}>{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* 3. Right Action */}
      <div className={styles.ctaBlock}>
        <button type="button" className={styles.writeReviewBtn} onClick={onWriteReviewClick}>
          ✍️ Write a Review
        </button>
        <span className={styles.guaranteeNote}>100% Verified Guest Reviews</span>
      </div>
    </div>
  );
};
