'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PackageCard.module.css';
import { Package } from '@/lib/types';
import { CallbackModal } from '@/components/common/CallbackModal';

interface PackageCardProps {
  pkg: Package;
  variant?: 'grid' | 'horizontal';
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, variant = 'grid' }) => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const mainImage =
    pkg.images && pkg.images.length > 0
      ? pkg.images[0]
      : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';

  // Badge selector
  let badgeText = 'BESTSELLER';
  if (pkg.price_per_person >= 25000) badgeText = 'LUXURY RETREAT';
  else if (pkg.rating_avg >= 4.9) badgeText = 'TOP RATED';
  else if (pkg.audience.includes('couple')) badgeText = 'HONEYMOON FAV';

  return (
    <>
      <div className={`${styles.card} ${variant === 'horizontal' ? styles.horizontalCard : ''}`}>
        {/* Card Image with badges */}
        <div className={styles.imageContainer}>
          <Link href={`/packages/${pkg.slug}`} className={styles.imageLink}>
            <Image
              src={mainImage}
              alt={pkg.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 389px"
              className={styles.image}
            />
          </Link>

          {/* Badges Overlay */}
          <div className={styles.badgesOverlay}>
            <span className={styles.bestsellerBadge}>{badgeText}</span>
            <span className={styles.expertBadge}>Expert Assisted</span>
          </div>

          {/* Duration overlay badge */}
          <div className={styles.durationPill}>
            <span>{pkg.duration}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className={styles.content}>
          {/* Meta Row: Rating & Destination */}
          <div className={styles.metaRow}>
            <div className={styles.ratingBox}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.ratingAvg}>{pkg.rating_avg.toFixed(1)}</span>
              <span className={styles.reviewCount}>({pkg.review_count} reviews)</span>
            </div>
            <span className={styles.destinationTag}>{pkg.destination}</span>
          </div>

          {/* Package Title */}
          <h3 className={styles.title}>
            <Link href={`/packages/${pkg.slug}`} className={styles.titleLink}>
              {pkg.title}
            </Link>
          </h3>

          {/* Inclusion Chips */}
          <div className={styles.inclusionsRow}>
            <span className={styles.inclusionChip}>🏨 Premium Stay</span>
            <span className={styles.inclusionChip}>🚗 Private SUV</span>
            <span className={styles.inclusionChip}>🍽️ Daily Meals</span>
          </div>

          {/* Card Footer: Pricing & Action Buttons */}
          <div className={styles.footer}>
            <div className={styles.priceBlock}>
              {pkg.original_price && (
                <div className={styles.originalPriceRow}>
                  <span className={styles.originalPrice}>
                    ₹{pkg.original_price.toLocaleString('en-IN')}
                  </span>
                  {pkg.discount_percent && (
                    <span className={styles.discountBadge}>{pkg.discount_percent}% OFF</span>
                  )}
                </div>
              )}

              <div className={styles.currentPriceRow}>
                <span className={styles.inrSymbol}>₹</span>
                <span className={styles.priceAmount}>
                  {pkg.price_per_person.toLocaleString('en-IN')}
                </span>
                <span className={styles.priceUnit}>/ {pkg.price_unit}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.callbackBtn}
                onClick={() => setIsCallbackOpen(true)}
              >
                Request Callback
              </button>
              <Link href={`/packages/${pkg.slug}`} className={styles.viewBtn}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Callback Modal for this package */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        packageId={pkg.id}
        packageTitle={pkg.title}
      />
    </>
  );
};
