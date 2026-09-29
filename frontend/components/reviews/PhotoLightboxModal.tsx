'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './PhotoLightboxModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  travelerName: string;
  tripLabel?: string;
  packageTitle?: string;
}

export const PhotoLightboxModal: React.FC<Props> = ({
  isOpen,
  onClose,
  imageUrl,
  travelerName,
  tripLabel,
  packageTitle,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Close photo preview"
        >
          ✕
        </button>

        <div className={styles.imageFrame}>
          <Image
            src={imageUrl}
            alt={`Travel photo by ${travelerName}`}
            fill
            sizes="900px"
            className={styles.lightboxImg}
            priority
          />
        </div>

        <div className={styles.captionBar}>
          <div className={styles.captionInfo}>
            <h4>Photo captured by {travelerName}</h4>
            <p>
              {tripLabel ? `${tripLabel} • ` : ''}
              {packageTitle || 'Aariva Voyages Expedition'}
            </p>
          </div>
          <span className={styles.navBadge}>✓ Verified Traveler Photo</span>
        </div>
      </div>
    </div>
  );
};
