'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './CallbackForm.module.css';
import { submitCallbackInquiry } from '@/lib/api';
import { gsap, useGSAP, DrawSVGPlugin } from '@/lib/gsap';

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

  const panelRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Focus confirmation panel when success becomes true
  useEffect(() => {
    if (success && panelRef.current) {
      panelRef.current.focus();
    }
  }, [success]);

  // GSAP DrawSVGPlugin timeline (~0.9s total)
  useGSAP(
    () => {
      if (!success) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReducedMotion) {
        // Show finished checkmark without drawing animation
        if (circleRef.current) gsap.set(circleRef.current, { drawSVG: '100%' });
        if (checkRef.current) gsap.set(checkRef.current, { drawSVG: '100%' });
        if (textRef.current) gsap.set(textRef.current, { opacity: 1 });
      } else {
        // Set initial hidden state in JS
        if (circleRef.current) gsap.set(circleRef.current, { drawSVG: '0%' });
        if (checkRef.current) gsap.set(checkRef.current, { drawSVG: '0%' });
        if (textRef.current) gsap.set(textRef.current, { opacity: 0 });

        const tl = gsap.timeline();

        // 1. Circle draws itself (~0.4s)
        tl.to(circleRef.current, {
          drawSVG: '100%',
          duration: 0.4,
          ease: 'power2.out',
        })
          // 2. Checkmark draws (~0.3s)
          .to(checkRef.current, {
            drawSVG: '100%',
            duration: 0.3,
            ease: 'power2.out',
          })
          // 3. Text fades in (~0.2s) -> Total ~0.9s
          .to(textRef.current, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
          });
      }
    },
    { dependencies: [success] }
  );

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
      <div
        ref={panelRef}
        tabIndex={-1}
        aria-live="polite"
        className={styles.successCard}
      >
        <svg className={styles.successSvg} viewBox="0 0 100 100" aria-hidden="true">
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r="40"
            stroke="#00a572"
            strokeWidth="4"
            fill="none"
          />
          <path
            ref={checkRef}
            d="M 32 52 L 44 64 L 68 36"
            stroke="#00a572"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        <div ref={textRef} className={styles.successTextContainer}>
          <h3 className={styles.successTitle}>Inquiry Registered!</h3>
          <p className={styles.successMsg}>
            Thanks! The Aariva Voyages team will call or WhatsApp you shortly.
          </p>
          <div className={styles.helplineNotice} style={{ marginTop: '16px' }}>
            <span>Need urgent help? Call directly:</span>
            <a href="tel:+919876543210" className={styles.directCallLink}>
              📞 +91 98765 43210
            </a>
          </div>
          <br />
          <button type="button" onClick={handleReset} className={styles.anotherBtn} style={{ marginTop: '16px' }}>
            Submit Another Request
          </button>
        </div>
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
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mobile-number">10-Digit Mobile Number *</label>
            <div className={styles.phoneWrapper}>
              <span className={styles.prefix}>+91</span>
              <input
                id="mobile-number"
                type="tel"
                required
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
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="group-size">Number of Travelers</label>
            <select
              id="group-size"
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
            >
              <option value={1}>1 Traveler (Solo)</option>
              <option value={2}>2 Travelers (Couple / Honeymoon)</option>
              <option value={3}>3 - 5 Travelers (Small Group / Family)</option>
              <option value={6}>6+ Travelers (Large Group)</option>
            </select>
          </div>
        </div>

        <div className={styles.gridRow}>
          <div className={styles.field}>
            <label htmlFor="travel-from">Preferred Travel Date</label>
            <input
              id="travel-from"
              type="date"
              value={travelFrom}
              onChange={(e) => setTravelFrom(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="travel-to">Return Date (Optional)</label>
            <input
              id="travel-to"
              type="date"
              value={travelTo}
              onChange={(e) => setTravelTo(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="special-requests">Special Customization &amp; Preferences</label>
          <textarea
            id="special-requests"
            rows={3}
            placeholder="e.g. Need sea view resort, private candlelit dinner, high altitude permit assistance..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        <div className={styles.securityNote}>
          🔒 Your contact details are 100% confidential. No spam or unauthorized calls.
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Submitting Inquiry...' : 'Request Callback'}
        </button>
      </form>
    </div>
  );
};
