'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './CallbackModal.module.css';
import { submitCallbackInquiry } from '@/lib/api';
import { gsap, useGSAP } from '@/lib/gsap';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Focus modal confirmation panel when success becomes true
  useEffect(() => {
    if (success && modalPanelRef.current) {
      modalPanelRef.current.focus();
    }
  }, [success]);

  // Modal open entrance animation
  useGSAP(
    () => {
      if (!isOpen || !modalBoxRef.current) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          modalBoxRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      });
    },
    { scope: containerRef, dependencies: [isOpen] }
  );

  // Success DrawSVG animation
  useGSAP(
    () => {
      if (!success) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReducedMotion) {
        if (circleRef.current) gsap.set(circleRef.current, { drawSVG: '100%' });
        if (checkRef.current) gsap.set(checkRef.current, { drawSVG: '100%' });
        if (textRef.current) gsap.set(textRef.current, { opacity: 1 });
      } else {
        if (circleRef.current) gsap.set(circleRef.current, { drawSVG: '0%' });
        if (checkRef.current) gsap.set(checkRef.current, { drawSVG: '0%' });
        if (textRef.current) gsap.set(textRef.current, { opacity: 0 });

        const tl = gsap.timeline();

        // 1. Circle draws (~0.4s)
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
    <div
      ref={containerRef}
      className={styles.overlay}
      onClick={handleModalClose}
      role="dialog"
      aria-modal="true"
    >
      <div ref={modalBoxRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleModalClose} aria-label="Close modal">
          ✕
        </button>

        {success ? (
          <div
            ref={modalPanelRef}
            tabIndex={-1}
            aria-live="polite"
            className={styles.successState}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ width: '80px', height: '80px', margin: '0 auto 16px', display: 'block' }}
              aria-hidden="true"
            >
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

            <div ref={textRef}>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '8px' }}>
                Request Received!
              </h3>
              <p className={styles.successMessage} style={{ fontSize: '15px', color: 'var(--color-ink)', marginBottom: '8px' }}>
                Thanks! The Aariva Voyages team will call or WhatsApp you shortly.
              </p>
              <button
                className={styles.doneBtn}
                onClick={handleModalClose}
                style={{ marginTop: '16px' }}
              >
                Done
              </button>
            </div>
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
                  <label htmlFor="modal-travelers">Number of Travelers</label>
                  <select
                    id="modal-travelers"
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

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="modal-travel-from">Preferred Travel Date</label>
                  <input
                    id="modal-travel-from"
                    type="date"
                    value={travelFrom}
                    onChange={(e) => setTravelFrom(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="modal-travel-to">Return Date (Optional)</label>
                  <input
                    id="modal-travel-to"
                    type="date"
                    value={travelTo}
                    onChange={(e) => setTravelTo(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="modal-requests">Special Customizations &amp; Notes</label>
                <textarea
                  id="modal-requests"
                  rows={3}
                  placeholder="Tell us about preferred resorts, meal plans, or vehicle preferences..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
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
