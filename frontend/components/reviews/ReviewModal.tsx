'use client';

import React, { useState, useEffect } from 'react';
import styles from './ReviewModal.module.css';
import { submitReview } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  packageSlug: string;
  packageTitle: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  packageSlug,
  packageTitle,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [travelerName, setTravelerName] = useState<string>('');
  const [tripLabel, setTripLabel] = useState<string>('Couple Getaway');
  const [comment, setComment] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMsg('Please share a brief review of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const photos = photoUrl.trim() ? [photoUrl.trim()] : [];

    const result = await submitReview(packageSlug, {
      traveler_name: travelerName.trim(),
      rating,
      comment: comment.trim(),
      trip_label: tripLabel,
      photos,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.error || 'Failed to submit review. Please try again.');
    }
  };

  const getRatingDescriptor = (val: number) => {
    switch (val) {
      case 5:
        return 'Exceptional (5.0)';
      case 4:
        return 'Very Good (4.0)';
      case 3:
        return 'Average (3.0)';
      case 2:
        return 'Disappointing (2.0)';
      case 1:
        return 'Poor (1.0)';
      default:
        return '';
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.modalEyebrow}>COMMUNITY VOICES</span>
            <h3 className={styles.modalTitle}>Share Your Experience</h3>
            <p className={styles.helperText} style={{ marginTop: '0.25rem' }}>
              {packageTitle}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <h4 className={styles.successTitle}>Review Submitted!</h4>
            <p className={styles.successText}>
              Thank you for sharing your journey story with the Aariva Voyages community. Your
              review will be published shortly following verification.
            </p>
            <button type="button" className={styles.successCloseBtn} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

            <div className={styles.ratingSelectorGroup}>
              <span className={styles.ratingLabel}>YOUR OVERALL RATING</span>
              <div className={styles.starsInteractiveRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starBtn} ${(hoverRating || rating) >= star ? styles.starBtnActive : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                  >
                    ★
                  </button>
                ))}
                <span className={styles.ratingDescriptor}>
                  {getRatingDescriptor(hoverRating || rating)}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rev-traveler-name">Your Full Name *</label>
              <input
                id="rev-traveler-name"
                type="text"
                className={styles.input}
                placeholder="e.g. Rohan Kulkarni"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rev-trip-label">Trip Type / City</label>
              <select
                id="rev-trip-label"
                className={styles.select}
                value={tripLabel}
                onChange={(e) => setTripLabel(e.target.value)}
              >
                <option value="Honeymoon Special">Honeymoon Special</option>
                <option value="Couple Getaway">Couple Getaway</option>
                <option value="Family Vacation">Family Vacation</option>
                <option value="Adventure Group">Adventure Group</option>
                <option value="Solo Explorer">Solo Explorer</option>
                <option value="Friends Reunion">Friends Reunion</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rev-comment">Your Review / Highlights *</label>
              <textarea
                id="rev-comment"
                className={styles.textarea}
                placeholder="Tell other travelers about your experience: how was the chauffeur, hotel stays, views, and overall service?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <span className={styles.helperText}>Minimum 10 characters</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rev-photo-url">Traveler Photo URL (Optional)</label>
              <input
                id="rev-photo-url"
                type="url"
                className={styles.input}
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
              <span className={styles.helperText}>
                Share a link to a scenic photo you captured during this trip
              </span>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Review...' : 'Post Verified Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
