'use client';

import React, { useState } from 'react';
import styles from './CallbackForm.module.css';
import { submitCallbackInquiry } from '@/lib/api';

interface CallbackFormProps {
  packageId?: string | null;
  packageTitle?: string;
  defaultDate?: string;
  defaultGroupSize?: number;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const CallbackForm: React.FC<CallbackFormProps> = ({
  packageId,
  packageTitle,
  defaultDate = '',
  defaultGroupSize = 2,
  onSuccess,
  title = 'Request a Free Callback',
  subtitle = 'Share your travel preferences and our destination specialist will contact you with customized options.',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelFrom, setTravelFrom] = useState(defaultDate);
  const [travelTo, setTravelTo] = useState('');
  const [groupSize, setGroupSize] = useState(defaultGroupSize);
  const [specialRequests, setSpecialRequests] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate 10-digit Indian phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !['6', '7', '8', '9'].includes(cleanPhone[0])) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (travelFrom && travelTo && travelTo < travelFrom) {
      setError('Return date cannot be earlier than departure date.');
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
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || 'Failed to submit request. Please try again or call our helpline.');
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setTravelFrom('');
    setTravelTo('');
    setSpecialRequests('');
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Inquiry Registered!</h3>
        <p className={styles.successMsg}>
          Thanks! Our team will call you shortly on <strong>+91 {phone}</strong>.
        </p>
        <p className={styles.successSub}>
          One of our trip marshals is reviewing your travel dates and tailoring the best itinerary
          quotes for you.
        </p>
        <div className={styles.helplineNotice}>
          <span>Need urgent help? Call directly:</span>
          <a href="tel:+919876543210" className={styles.directCallLink}>
            📞 +91 98765 43210
          </a>
        </div>
        <button type="button" onClick={handleReset} className={styles.anotherBtn}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>EXPERT ASSISTANCE</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>
          {packageTitle ? (
            <>
              Customizing quote for: <strong>{packageTitle}</strong>
            </>
          ) : (
            subtitle
          )}
        </p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Invisible honeypot field for bot detection */}
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

        <div className={styles.gridRow}>
          <div className={styles.field}>
            <label htmlFor="full-name">Full Name *</label>
            <input
              id="full-name"
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone-number">10-Digit Mobile Number *</label>
            <div className={styles.phoneWrapper}>
              <span className={styles.prefix}>+91</span>
              <input
                id="phone-number"
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.gridRow}>
          <div className={styles.field}>
            <label htmlFor="email-address">Email Address (Optional)</label>
            <input
              id="email-address"
              type="email"
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="group-count">Number of Travelers</label>
            <select
              id="group-count"
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
            >
              <option value={1}>1 Solo Explorer</option>
              <option value={2}>2 Couple / Duo</option>
              <option value={3}>3 Friends / Family</option>
              <option value={4}>4 Family (4 Pax)</option>
              <option value={6}>5-8 Group</option>
              <option value={12}>9+ Large Group</option>
            </select>
          </div>
        </div>

        <div className={styles.gridRow}>
          <div className={styles.field}>
            <label htmlFor="date-from">Travel Date (From)</label>
            <input
              id="date-from"
              type="date"
              value={travelFrom}
              onChange={(e) => setTravelFrom(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="date-to">Return Date (To)</label>
            <input
              id="date-to"
              type="date"
              value={travelTo}
              onChange={(e) => setTravelTo(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="special-notes">Special Requests / Preferences</label>
          <textarea
            id="special-notes"
            rows={3}
            placeholder="e.g. Honeymoon candlelight setup, mountain view rooms, pure veg food, airport pickup timing..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        <div className={styles.securityNote}>
          🔒 Your contact info is strictly confidential. No spam, guaranteed.
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Submitting Request...' : 'Request Callback'}
        </button>
      </form>
    </div>
  );
};
