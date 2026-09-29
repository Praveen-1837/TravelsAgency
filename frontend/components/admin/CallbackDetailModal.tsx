'use client';

import React, { useState } from 'react';
import styles from './CallbackDetailModal.module.css';
import { CallbackRecord } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callback: CallbackRecord | null;
  onUpdate: (
    id: string,
    updates: { status?: CallbackRecord['status']; notes?: string; assigned_to?: string }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CallbackDetailModal: React.FC<Props> = (props) => {
  if (!props.isOpen || !props.callback) return null;
  return (
    <CallbackDetailModalContent key={props.callback.id} {...props} callback={props.callback} />
  );
};

const CallbackDetailModalContent: React.FC<Props & { callback: CallbackRecord }> = ({
  onClose,
  callback,
  onUpdate,
  onDelete,
}) => {
  const [status, setStatus] = useState<CallbackRecord['status']>(callback.status);
  const [notes, setNotes] = useState<string>(callback.notes || '');
  const [assignedTo, setAssignedTo] = useState<string>(callback.assigned_to || '');
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(callback.id, {
      status,
      notes,
      assigned_to: assignedTo,
    });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete inquiry for ${callback.name}?`)) {
      await onDelete(callback.id);
      onClose();
    }
  };

  const cleanPhone = callback.phone.replace(/\D/g, '');
  const whatsAppNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>INQUIRY DETAILS</span>
            <h3 className={styles.title}>{callback.name}</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {/* Quick Contact Header */}
          <div className={styles.contactBanner}>
            <div className={styles.contactInfo}>
              <h4>{callback.name}</h4>
              <div className={styles.contactDetails}>
                <span>📞 +91 {callback.phone}</span>
                {callback.email && <span>✉️ {callback.email}</span>}
              </div>
            </div>

            <div className={styles.quickActions}>
              <a href={`tel:+91${cleanPhone}`} className={styles.callBtn}>
                📞 Call Now
              </a>
              <a
                href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(`Hello ${callback.name}, greetings from Aariva Voyages! We received your callback inquiry regarding your upcoming travel plans.`)}`}
                target="_blank"
                rel="noreferrer"
                className={styles.whatsAppBtn}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Travel Details Grid */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>PACKAGE INQUIRED</label>
              <span>{callback.package_title || 'General Domestic Customization'}</span>
            </div>

            <div className={styles.infoItem}>
              <label>TRAVEL DATES</label>
              <span>
                {callback.travel_from || 'Flexible'} → {callback.travel_to || 'Flexible'}
              </span>
            </div>

            <div className={styles.infoItem}>
              <label>NUMBER OF TRAVELERS</label>
              <span>{callback.group_size || 2} Guests</span>
            </div>

            <div className={styles.infoItem}>
              <label>INQUIRY DATE</label>
              <span>{new Date(callback.created_at).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Special Requests */}
          {callback.special_requests && (
            <div className={styles.specialRequestsBox}>
              <label>CUSTOMER SPECIAL REQUESTS &amp; PREFERENCES</label>
              <p>&ldquo;{callback.special_requests}&rdquo;</p>
            </div>
          )}

          {/* Edit & Internal Notes Form */}
          <div className={styles.editForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cb-status">Inquiry Status</label>
                <select
                  id="cb-status"
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CallbackRecord['status'])}
                >
                  <option value="new">🔴 New / Uncontacted</option>
                  <option value="contacted">🟡 Contacted &amp; Quoted</option>
                  <option value="converted">🟢 Converted / Confirmed</option>
                  <option value="closed">⚪ Closed / Cancelled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cb-assignee">Assigned Travel Marshal</label>
                <input
                  id="cb-assignee"
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Sunil Rao / Operations"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cb-notes">Internal Notes &amp; Follow-up Log</label>
              <textarea
                id="cb-notes"
                className={styles.textarea}
                placeholder="Log notes: e.g. 'Called on WhatsApp, sent customized itinerary PDF, requested 4-star hotel options...'"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
            🗑️ Delete Inquiry
          </button>

          <div className={styles.actionBtns}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Updates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
