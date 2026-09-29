'use client';

import React, { useState } from 'react';
import styles from './PackageFormModal.module.css';
import { Package } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  packageToEdit: Package | null;
  onSave: (pkgData: Partial<Package>) => Promise<void>;
}

export const PackageFormModal: React.FC<Props> = (props) => {
  if (!props.isOpen) return null;
  return <PackageFormModalContent key={props.packageToEdit?.id || 'new'} {...props} />;
};

const PackageFormModalContent: React.FC<Props> = ({ onClose, packageToEdit, onSave }) => {
  const [title, setTitle] = useState(packageToEdit?.title || '');
  const [destination, setDestination] = useState(packageToEdit?.destination || '');
  const [slug, setSlug] = useState(packageToEdit?.slug || '');
  const [durationDays, setDurationDays] = useState(packageToEdit?.duration_days ?? 5);
  const [durationNights, setDurationNights] = useState(packageToEdit?.duration_nights ?? 4);
  const [pricePerPerson, setPricePerPerson] = useState(packageToEdit?.price_per_person ?? 15000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(
    packageToEdit?.original_price ?? 18000
  );
  const discountPercent =
    originalPrice && originalPrice > pricePerPerson
      ? Math.round(((originalPrice - pricePerPerson) / originalPrice) * 100)
      : packageToEdit?.discount_percent;
  const [priceUnit, setPriceUnit] = useState<'person' | 'couple'>(
    packageToEdit?.price_unit || 'person'
  );
  const [description, setDescription] = useState(packageToEdit?.description || '');
  const [inclusionsText, setInclusionsText] = useState(
    packageToEdit
      ? packageToEdit.inclusions.join('\n')
      : 'Hotel Stays\nDaily Breakfast & Dinner\nPrivate SUV Transfers'
  );
  const [imagesText, setImagesText] = useState(
    packageToEdit
      ? packageToEdit.images.join('\n')
      : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
  );
  const [isActive, setIsActive] = useState(packageToEdit ? packageToEdit.is_active : true);
  const [isFeatured, setIsFeatured] = useState(packageToEdit ? packageToEdit.is_featured : false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const inclusions = inclusionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    await onSave({
      title: title.trim(),
      destination: destination.trim(),
      slug: generatedSlug,
      duration_days: Number(durationDays),
      duration_nights: Number(durationNights),
      duration: `${durationNights}N/${durationDays}D`,
      price_per_person: Number(pricePerPerson),
      original_price: originalPrice ? Number(originalPrice) : undefined,
      discount_percent: discountPercent ? Number(discountPercent) : undefined,
      price_unit: priceUnit,
      audience: ['couple', 'family', 'group'],
      description: description.trim(),
      inclusions,
      images,
      is_active: isActive,
      is_featured: isFeatured,
    });

    setSaving(false);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              {packageToEdit ? 'EDIT PACKAGE' : 'CREATE NEW PACKAGE'}
            </span>
            <h3 className={styles.title}>
              {packageToEdit ? packageToEdit.title : 'Add Tour Itinerary'}
            </h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row2}>
            <div className={styles.formGroup}>
              <label>Package Title *</label>
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sikkim &amp; Darjeeling Himalayan Escapade"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Destination *</label>
              <input
                type="text"
                className={styles.input}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Sikkim-Darjeeling"
                required
              />
            </div>
          </div>

          <div className={styles.row3}>
            <div className={styles.formGroup}>
              <label>URL Slug</label>
              <input
                type="text"
                className={styles.input}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Auto-generated from title"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Duration Nights</label>
              <input
                type="number"
                className={styles.input}
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                min={1}
                max={30}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Duration Days</label>
              <input
                type="number"
                className={styles.input}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min={1}
                max={30}
                required
              />
            </div>
          </div>

          <div className={styles.row3}>
            <div className={styles.formGroup}>
              <label>Price (₹) *</label>
              <input
                type="number"
                className={styles.input}
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(Number(e.target.value))}
                min={1000}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Original Price (₹)</label>
              <input
                type="number"
                className={styles.input}
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Price Unit</label>
              <select
                className={styles.select}
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as 'person' | 'couple')}
              >
                <option value="person">Per Person</option>
                <option value="couple">Per Couple</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Overview Description *</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight the experiences, sights, and scenic locations included in this trip..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Inclusions (One per line)</label>
            <textarea
              className={styles.textarea}
              value={inclusionsText}
              onChange={(e) => setInclusionsText(e.target.value)}
              placeholder="Private SUV transfers&#10;Daily breakfast &amp; dinner&#10;Permits &amp; parking"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image URLs (One per line)</label>
            <textarea
              className={styles.textarea}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className={styles.checkboxesRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active on Public Website
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured on Home Page
            </label>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving Package...' : 'Save Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
