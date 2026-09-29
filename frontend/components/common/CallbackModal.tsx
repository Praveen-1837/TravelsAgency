'use client';

import React, { useState } from 'react';
import styles from './CallbackModal.module.css';
import { submitCallbackInquiry } from '@/lib/api';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string | null;
  packageTitle?: string;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  packageId,
  packageTitle,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelFrom, setTravelFrom] = useState('');
  const [travelTo, setTravelTo] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !['6', '7', '8', '9'].includes(cleanPhone[0])) {
      setError('Please provide a valid 10-digit Indian mobile number (starting with 6-9).');
      return;
    }

    setLoading(true);

    const res = await submitCallbackInquiry({
      package_id: packageId,
      name,
      phone: cleanPhone,
      email: email || undefined,
      travel_from: travelFrom || undefined,
      travel_to: travelTo || undefined,
      group_size: Number(groupSize),
      special_requests: specialRequests || undefined,
      website_hp: honeypot,
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        // Reset and close after a delay if user doesn't close manually
      }, 4000);
    } else {
      setError(res.error || 'Failed to submit inquiry. Please try again.');
    }
  };

  const handleModalClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleModalClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleModalClose} aria-label="Close modal">
          ✕
        </button>

        {success ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h3>Request Received!</h3>
            <p className={styles.successMessage}>
              Thanks! Our team will call you shortly on <strong>+91 {phone}</strong>.
            </p>
            <p className={styles.subtext}>
              One of our destination specialists is preparing tailored itineraries and exclusive
              discounts for you.
            </p>
            <button className={styles.doneBtn} onClick={handleModalClose}>
              Explore More Journeys
            </button>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <span className={styles.eyebrow}>EXPERT-ASSISTED PLANNING</span>
              <h2 className={styles.modalTitle}>Request a Free Callback</h2>
              <p className={styles.modalSubtitle}>
                {packageTitle ? (
                  <>
                    Inquiring for: <strong>{packageTitle}</strong>
                  </>
                ) : (
                  'Speak with our India domestic travel specialist — no booking fees or obligations.'
                )}
              </p>
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Honeypot field invisible to humans */}
              <div className="sr-only" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="modal-name">Your Full Name *</label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="modal-phone">10-Digit Mobile Number *</label>
                  <div className={styles.phoneInput}>
                    <span className={styles.countryCode}>+91</span>
                    <input
                      id="modal-phone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="modal-email">Email Address (Optional)</label>
                  <input
                    id="modal-email"
                    type="email"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="modal-group">Number of Travelers</label>
                  <select
                    id="modal-group"
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                  >
                    <option value={1}>1 Solo Explorer</option>
                    <option value={2}>2 Couple / Duo</option>
                    <option value={3}>3 Small Group</option>
                    <option value={4}>4 Family / Friends (4)</option>
                    <option value={5}>5-8 Group</option>
                    <option value={10}>9+ Large Group</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="modal-travel-from">Preferred Travel Date (From)</label>
                  <input
                    id="modal-travel-from"
                    type="date"
                    value={travelFrom}
                    onChange={(e) => setTravelFrom(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="modal-travel-to">Return Date (To)</label>
                  <input
                    id="modal-travel-to"
                    type="date"
                    value={travelTo}
                    onChange={(e) => setTravelTo(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="modal-requests">Special Requests / Preferences</label>
                <textarea
                  id="modal-requests"
                  rows={2}
                  placeholder="e.g. Honeymoon candlelight dinner, mountain-facing rooms, vegetarian food..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <div className={styles.privacyNote}>
                🔒 Your contact details are safe. Aariva Voyages will only reach out regarding your
                trip request.
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Submitting Request...' : 'Request Callback'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
