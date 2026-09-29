'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ReviewCard.module.css';
import { Review } from '@/lib/types';

interface Props {
  review: Review;
  onPhotoClick?: (photoUrl: string, travelerName: string, tripLabel?: string) => void;
  showPackageLink?: boolean;
}

export const ReviewCard: React.FC<Props> = ({ review, onPhotoClick, showPackageLink = false }) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(review.helpful_count || 12);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleHelpfulClick = () => {
    if (hasVoted) {
      setHelpfulCount((prev) => prev - 1);
      setHasVoted(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recent Travel';
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorMeta}>
          <div className={styles.avatar}>{getInitials(review.traveler_name)}</div>
          <div>
            <div className={styles.nameRow}>
              <h4 className={styles.authorName}>{review.traveler_name}</h4>
              <span className={styles.verifiedBadge}>✓ Verified Traveler</span>
            </div>
            <div className={styles.subtitleRow}>
              {review.trip_label && <span className={styles.tripLabel}>{review.trip_label}</span>}
              <span className={styles.dateText}>• {formatDate(review.created_at)}</span>
            </div>
          </div>
        </div>

        <div className={styles.ratingBox}>
          <div className={styles.stars}>{'★'.repeat(review.rating)}</div>
          <span className={styles.ratingNumber}>{review.rating}.0 / 5.0</span>
        </div>
      </div>

      <p className={styles.comment}>{review.comment}</p>

      {/* Traveler Photos Strip */}
      {review.photos && review.photos.length > 0 && (
        <div className={styles.photosGrid}>
          {review.photos.map((photo, idx) => (
            <div
              key={idx}
              className={styles.photoThumbnail}
              onClick={() =>
                onPhotoClick && onPhotoClick(photo, review.traveler_name, review.trip_label)
              }
              title="Click to view full photo"
            >
              <Image
                src={photo}
                alt={`${review.traveler_name} trip photo ${idx + 1}`}
                fill
                sizes="90px"
              />
              <div className={styles.photoOverlayHint}>🔍</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.helpfulBtn} ${hasVoted ? styles.helpfulBtnActive : ''}`}
          onClick={handleHelpfulClick}
          aria-label="Vote review as helpful"
        >
          👍 Helpful ({helpfulCount})
        </button>

        {showPackageLink && review.package_slug && (
          <Link href={`/packages/${review.package_slug}`} className={styles.packageBadgeLink}>
            📍 {review.package_title || 'View Package'} →
          </Link>
        )}
      </div>
    </article>
  );
};
