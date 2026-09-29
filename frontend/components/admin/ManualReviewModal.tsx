'use client';

import React, { useState } from 'react';
import styles from './ManualReviewModal.module.css';
import { Package } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  onSubmit: (reviewData: {
    package_id: string;
    traveler_name: string;
    rating: number;
    comment: string;
    photos?: string[];
    trip_label?: string;
  }) => Promise<void>;
}

export const ManualReviewModal: React.FC<Props> = ({ isOpen, onClose, packages, onSubmit }) => {
  const [packageId, setPackageId] = useState<string>(packages[0]?.id || '');
  const [travelerName, setTravelerName] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [tripLabel, setTripLabel] = useState<string>('Family Vacation');
  const [comment, setComment] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageId || !travelerName.trim() || !comment.trim()) return;

    setSaving(true);
    const photos = photoUrl.trim() ? [photoUrl.trim()] : [];

    await onSubmit({
      package_id: packageId,
      traveler_name: travelerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      photos,
      trip_label: tripLabel.trim(),
    });

    setSaving(false);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>MANUAL COLLECTION</span>
            <h3 className={styles.title}>Record Verified Guest Review</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tour Package *</label>
            <select
              className={styles.select}
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              required
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} ({pkg.destination})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Traveler / Couple / Group Name *</label>
            <input
              type="text"
              className={styles.input}
              value={travelerName}
              onChange={(e) => setTravelerName(e.target.value)}
              placeholder="e.g. Siddharth &amp; Karishma Oberoi"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Star Rating *</label>
            <select
              className={styles.select}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>★★★★★ 5.0 (Exceptional)</option>
              <option value={4}>★★★★☆ 4.0 (Very Good)</option>
              <option value={3}>★★★☆☆ 3.0 (Average)</option>
              <option value={2}>★★☆☆☆ 2.0 (Needs Improvement)</option>
              <option value={1}>★☆☆☆☆ 1.0 (Unsatisfied)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Trip Label / City</label>
            <input
              type="text"
              className={styles.input}
              value={tripLabel}
              onChange={(e) => setTripLabel(e.target.value)}
              placeholder="e.g. Luxury Honeymoon (Mumbai)"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Traveler Review / Testimonial *</label>
            <textarea
              className={styles.textarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter customer feedback collected via WhatsApp, phone, or feedback form..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Guest Photo URL (Optional)</label>
            <input
              type="url"
              className={styles.input}
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Publishing...' : 'Approve &amp; Publish Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
