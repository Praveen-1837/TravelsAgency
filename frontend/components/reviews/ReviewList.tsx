'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './ReviewList.module.css';
import { Review } from '@/lib/types';
import { ReviewCard } from './ReviewCard';
import { PhotoLightboxModal } from './PhotoLightboxModal';

interface Props {
  reviews: Review[];
  packageTitle: string;
  selectedStarFilter?: number | null;
  onClearStarFilter?: () => void;
}

export const ReviewList: React.FC<Props> = ({
  reviews,
  packageTitle,
  selectedStarFilter,
  onClearStarFilter,
}) => {
  const [filterType, setFilterType] = useState<'all' | '5' | '4' | 'photos'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  // Photo Lightbox State
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTraveler, setLightboxTraveler] = useState<string>('');
  const [lightboxTripLabel, setLightboxTripLabel] = useState<string | undefined>(undefined);

  // Extract all photos across reviews
  const allTravelerPhotos = useMemo(() => {
    const list: { url: string; traveler: string; tripLabel?: string }[] = [];
    reviews.forEach((r) => {
      if (r.photos && r.photos.length > 0) {
        r.photos.forEach((photo) => {
          list.push({ url: photo, traveler: r.traveler_name, tripLabel: r.trip_label });
        });
      }
    });
    return list;
  }, [reviews]);

  // Handle photo click from review card or photo gallery
  const handleOpenPhoto = (url: string, traveler: string, tripLabel?: string) => {
    setLightboxImg(url);
    setLightboxTraveler(traveler);
    setLightboxTripLabel(tripLabel);
  };

  // Filter & Sort reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Priority filter from score card if active
    if (selectedStarFilter !== null && selectedStarFilter !== undefined) {
      result = result.filter((r) => r.rating === selectedStarFilter);
    } else {
      // Local pills filter
      if (filterType === '5') {
        result = result.filter((r) => r.rating === 5);
      } else if (filterType === '4') {
        result = result.filter((r) => r.rating === 4);
      } else if (filterType === 'photos') {
        result = result.filter((r) => r.photos && r.photos.length > 0);
      }
    }

    // Sort
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
    }

    return result;
  }, [reviews, filterType, sortBy, selectedStarFilter]);

  return (
    <div className={styles.wrapper}>
      {/* 1. Traveler Photo Gallery Strip (if photos exist) */}
      {allTravelerPhotos.length > 0 && (
        <section className={styles.photosGallerySection}>
          <div className={styles.photosGalleryHeader}>
            <h4 className={styles.photosGalleryTitle}>
              📸 Traveler Photos from this Expedition
              <span className={styles.photoCount}>({allTravelerPhotos.length} photos)</span>
            </h4>
          </div>

          <div className={styles.photosScrollRow}>
            {allTravelerPhotos.map((item, idx) => (
              <div
                key={idx}
                className={styles.galleryThumbItem}
                onClick={() => handleOpenPhoto(item.url, item.traveler, item.tripLabel)}
                title={`Photo by ${item.traveler} - click to enlarge`}
              >
                <Image
                  src={item.url}
                  alt={`Traveler photo by ${item.traveler}`}
                  fill
                  sizes="120px"
                />
                <span className={styles.photoOwnerOverlay}>{item.traveler}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Filter & Sort Bar */}
      <div className={styles.filterSortBar}>
        <div className={styles.filterPills}>
          {selectedStarFilter ? (
            <button
              type="button"
              className={`${styles.filterPill} ${styles.activeFilterPill}`}
              onClick={onClearStarFilter}
            >
              ★ Showing {selectedStarFilter} Stars Only ✕
            </button>
          ) : (
            <>
              <button
                type="button"
                className={`${styles.filterPill} ${filterType === 'all' ? styles.activeFilterPill : ''}`}
                onClick={() => setFilterType('all')}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${filterType === 'photos' ? styles.activeFilterPill : ''}`}
                onClick={() => setFilterType('photos')}
              >
                With Photos ({allTravelerPhotos.length})
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${filterType === '5' ? styles.activeFilterPill : ''}`}
                onClick={() => setFilterType('5')}
              >
                5 Stars
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${filterType === '4' ? styles.activeFilterPill : ''}`}
                onClick={() => setFilterType('4')}
              >
                4 Stars
              </button>
            </>
          )}
        </div>

        <div className={styles.sortControls}>
          <label htmlFor="review-sort-select">Sort by:</label>
          <select
            id="review-sort-select"
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating' | 'helpful')}
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* 3. Reviews Grid / List */}
      {filteredReviews.length > 0 ? (
        <div className={styles.reviewsGrid}>
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onPhotoClick={handleOpenPhoto} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💬</span>
          <h4 className={styles.emptyTitle}>No matching reviews found</h4>
          <p className={styles.emptySubtitle}>
            Try clearing the selected filter to see all verified traveler reviews.
          </p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setFilterType('all');
              if (onClearStarFilter) onClearStarFilter();
            }}
          >
            Show All Reviews
          </button>
        </div>
      )}

      {/* 4. Fullscreen Photo Lightbox Modal */}
      {lightboxImg && (
        <PhotoLightboxModal
          isOpen={!!lightboxImg}
          onClose={() => setLightboxImg(null)}
          imageUrl={lightboxImg}
          travelerName={lightboxTraveler}
          tripLabel={lightboxTripLabel}
          packageTitle={packageTitle}
        />
      )}
    </div>
  );
};
