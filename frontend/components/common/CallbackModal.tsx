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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Field refs for validation shake & focus
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const travelToRef = useRef<HTMLInputElement>(null);

  // Modal & Confirmation panel GSAP DOM refs
  const containerRef = useRef<HTMLDivElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const successPanelRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<SVGCircleElement>(null);
  const badgeCircleRef = useRef<SVGCircleElement>(null);
  const checkmarkPathRef = useRef<SVGPathElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Reset state on modal open/re-open and track caller focus element
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      setSuccess(false);
      setLoading(false);
      setError(null);
      setFieldErrors({});

      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (formContentRef.current) gsap.set(formContentRef.current, { clearProps: 'all' });
      if (successPanelRef.current) gsap.set(successPanelRef.current, { clearProps: 'all' });
      if (modalBoxRef.current) gsap.set(modalBoxRef.current, { clearProps: 'all' });
      if (containerRef.current) gsap.set(containerRef.current, { clearProps: 'all' });
    }
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Toast 5-second auto-dismiss
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Entrance animation when modal opens
  useGSAP(
    () => {
      if (!isOpen || !modalBoxRef.current) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion) {
        gsap.fromTo(
          modalBoxRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    },
    { scope: containerRef, dependencies: [isOpen] }
  );

  // Close modal mid-animation or user close action
  const handleModalClose = () => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    setSuccess(false);
    setLoading(false);
    setError(null);
    setFieldErrors({});

    onClose();

    if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
    }
  };

  // Close modal after success hold or Done button click, then show toast
  const triggerCloseAndToast = () => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    setSuccess(false);
    setLoading(false);
    setError(null);
    setFieldErrors({});

    onClose();
    setShowToast(true);

    if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
    }
  };

  // Timeline pause/resume during 2.5s hold on hover & focus
  const handleMouseEnter = () => {
    if (tlRef.current && tlRef.current.isActive()) {
      tlRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (tlRef.current && tlRef.current.paused()) {
      tlRef.current.play();
    }
  };

  const handleFocusIn = () => {
    if (tlRef.current && tlRef.current.isActive()) {
      tlRef.current.pause();
    }
  };

  const handleFocusOut = (e: React.FocusEvent) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(e.relatedTarget as Node)) {
      if (tlRef.current && tlRef.current.paused()) {
        tlRef.current.play();
      }
    }
  };

  // GSAP timeline sequence on successful submit
  useGSAP(
    () => {
      if (!success) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Avoid layout height jump by setting minHeight
      if (modalBoxRef.current) {
        const h = modalBoxRef.current.getBoundingClientRect().height;
        gsap.set(modalBoxRef.current, { minHeight: `${Math.round(h)}px` });
      }

      if (isReducedMotion) {
        // Reduced motion: no pop, ring, draw or scale, skip auto-close
        if (formContentRef.current) gsap.set(formContentRef.current, { display: 'none' });
        if (successPanelRef.current) gsap.set(successPanelRef.current, { display: 'flex', opacity: 0 });
        if (badgeCircleRef.current) gsap.set(badgeCircleRef.current, { scale: 1, opacity: 1 });
        if (pulseRingRef.current) gsap.set(pulseRingRef.current, { opacity: 0 });
        if (checkmarkPathRef.current) gsap.set(checkmarkPathRef.current, { drawSVG: '100%' });
        if (textGroupRef.current) gsap.set(textGroupRef.current, { opacity: 1, y: 0 });

        gsap.to(successPanelRef.current, {
          opacity: 1,
          duration: 0.2,
          onComplete: () => {
            headingRef.current?.focus();
          },
        });
        return;
      }

      // Single GSAP timeline
      const tl = gsap.timeline({
        onComplete: () => {
          triggerCloseAndToast();
        },
      });
      tlRef.current = tl;

      // Setup initial states
      if (successPanelRef.current) gsap.set(successPanelRef.current, { display: 'none', opacity: 0 });
      if (badgeCircleRef.current) gsap.set(badgeCircleRef.current, { scale: 0, transformOrigin: '48px 48px' });
      if (pulseRingRef.current) gsap.set(pulseRingRef.current, { scale: 1, opacity: 0.35, transformOrigin: '48px 48px' });
      if (checkmarkPathRef.current) gsap.set(checkmarkPathRef.current, { drawSVG: '0%' });
      if (textGroupRef.current) gsap.set(textGroupRef.current, { opacity: 0, y: 12 });

      // Step 1: Form content fades out (opacity 0, y -8, 0.25s)
      tl.to(formContentRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          if (formContentRef.current) formContentRef.current.style.display = 'none';
          if (successPanelRef.current) {
            successPanelRef.current.style.display = 'flex';
            successPanelRef.current.style.opacity = '1';
          }
        },
      });

      tl.addLabel('popStart');

      // Step 2: Tick badge "pop" - #FF5722 filled circle scales 0 to 1 back.out(1.8) over 0.45s
      tl.to(
        badgeCircleRef.current,
        {
          scale: 1,
          duration: 0.45,
          ease: 'back.out(1.8)',
        },
        'popStart'
      );

      // Soft ring behind scales 1 to 1.6 while fading 0.35 to 0 over 0.35s
      tl.to(
        pulseRingRef.current,
        {
          scale: 1.6,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
        },
        'popStart'
      );

      // Step 3: White checkmark path draws (DrawSVG 0% to 100%, 0.4s, power2.out), 0.15s after pop begins
      tl.to(
        checkmarkPathRef.current,
        {
          drawSVG: '100%',
          duration: 0.4,
          ease: 'power2.out',
        },
        'popStart+=0.15'
      );

      // Step 4: Heading and text fade up (y 12 to 0, 0.35s)
      tl.to(
        textGroupRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            headingRef.current?.focus();
          },
        },
        'popStart+=0.25'
      );

      // Step 5: Hold for 2.5 seconds (paused if hovered or focused)
      tl.to({}, { duration: 2.5 });

      // Step 6: Modal panel fades and scales out (opacity 0, scale 0.96, 0.3s), overlay fades
      tl.to(modalBoxRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.3,
        ease: 'power2.in',
      });
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        '<'
      );
    },
    { dependencies: [success] }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submits
    if (loading || success) return;

    setError(null);
    setFieldErrors({});

    const newFieldErrors: Record<string, string> = {};
    const invalidEls: HTMLElement[] = [];

    // 1. Name validation
    if (!name.trim()) {
      newFieldErrors.name = 'Your full name is required.';
      if (nameRef.current) invalidEls.push(nameRef.current);
    }

    // 2. Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !['6', '7', '8', '9'].includes(cleanPhone[0])) {
      newFieldErrors.phone =
        'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
      if (phoneRef.current) invalidEls.push(phoneRef.current);
    }

    // 3. Email validation
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newFieldErrors.email = 'Please enter a valid email address.';
      if (emailRef.current) invalidEls.push(emailRef.current);
    }

    // 4. Return date validation
    if (travelFrom && travelTo && travelTo < travelFrom) {
      newFieldErrors.travelTo = 'Return date cannot be earlier than departure date.';
      if (travelToRef.current) invalidEls.push(travelToRef.current);
    }

    // If validation fails
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError('Please correct the highlighted errors before submitting.');

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion && invalidEls.length > 0) {
        gsap.killTweensOf(invalidEls);
        gsap.to(invalidEls, {
          x: 6,
          duration: 0.5,
          ease: 'invalidWiggle',
          clearProps: 'x',
        });
      }

      if (invalidEls.length > 0) {
        invalidEls[0].focus();
      }

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

  if (!isOpen && !showToast) return null;

  return (
    <>
      {/* Modal Dialog */}
      {isOpen && (
        <div
          ref={containerRef}
          className={styles.overlay}
          onClick={handleModalClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={success ? 'modal-success-heading' : 'modal-title'}
        >
          <div
            ref={modalBoxRef}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
          >
            <button className={styles.closeBtn} onClick={handleModalClose} aria-label="Close modal">
              ✕
            </button>

            {/* Success Panel */}
            <div
              ref={successPanelRef}
              style={{ display: success ? 'flex' : 'none' }}
              aria-live="polite"
              className={styles.successState}
            >
              <svg viewBox="0 0 96 96" className={styles.successBadgeSvg} aria-hidden="true">
                {/* Soft pulse ring behind */}
                <circle
                  ref={pulseRingRef}
                  cx="48"
                  cy="48"
                  r="32"
                  fill="none"
                  stroke="#FF5722"
                  strokeWidth="4"
                  opacity="0.35"
                />
                {/* Filled badge circle */}
                <circle ref={badgeCircleRef} cx="48" cy="48" r="32" fill="#FF5722" />
                {/* White checkmark path */}
                <path
                  ref={checkmarkPathRef}
                  d="M 32 48 L 43 59 L 64 37"
                  stroke="#FFFFFF"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>

              <div ref={textGroupRef} className={styles.textGroup}>
                <h3
                  ref={headingRef}
                  id="modal-success-heading"
                  tabIndex={-1}
                  className={styles.successTitle}
                >
                  Request received!
                </h3>
                <p className={styles.successMessage}>
                  Thanks! The Aariva Voyages team will call or WhatsApp you shortly.
                </p>
                <button
                  type="button"
                  onClick={triggerCloseAndToast}
                  className={styles.doneBtn}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div ref={formContentRef} style={{ display: success ? 'none' : 'block' }}>
              <div className={styles.modalHeader}>
                <span className={styles.eyebrow}>EXPERT-ASSISTED PLANNING</span>
                <h2 id="modal-title" className={styles.modalTitle}>
                  Request a Free Callback
                </h2>
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

              <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                      ref={nameRef}
                      id="modal-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      className={fieldErrors.name ? styles.inputError : ''}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'modal-name-error' : undefined}
                    />
                    {fieldErrors.name && (
                      <p id="modal-name-error" className={styles.fieldErrorMsg} role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-phone">10-Digit Mobile Number *</label>
                    <div
                      className={`${styles.phoneInput} ${
                        fieldErrors.phone ? styles.inputError : ''
                      }`}
                    >
                      <span className={styles.countryCode}>+91</span>
                      <input
                        ref={phoneRef}
                        id="modal-phone"
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? 'modal-phone-error' : undefined}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p id="modal-phone-error" className={styles.fieldErrorMsg} role="alert">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="modal-email">Email Address (Optional)</label>
                    <input
                      ref={emailRef}
                      id="modal-email"
                      type="email"
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={fieldErrors.email ? styles.inputError : ''}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'modal-email-error' : undefined}
                    />
                    {fieldErrors.email && (
                      <p id="modal-email-error" className={styles.fieldErrorMsg} role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
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
                      ref={travelToRef}
                      id="modal-travel-to"
                      type="date"
                      value={travelTo}
                      onChange={(e) => {
                        setTravelTo(e.target.value);
                        if (fieldErrors.travelTo)
                          setFieldErrors((prev) => ({ ...prev, travelTo: '' }));
                      }}
                      className={fieldErrors.travelTo ? styles.inputError : ''}
                      aria-invalid={!!fieldErrors.travelTo}
                      aria-describedby={fieldErrors.travelTo ? 'modal-travel-to-error' : undefined}
                    />
                    {fieldErrors.travelTo && (
                      <p id="modal-travel-to-error" className={styles.fieldErrorMsg} role="alert">
                        {fieldErrors.travelTo}
                      </p>
                    )}
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
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <div className={styles.toastIcon}>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className={styles.toastText}>
            Callback requested. We'll be in touch on WhatsApp/phone.
          </span>
          <button
            type="button"
            className={styles.toastCloseBtn}
            onClick={() => setShowToast(false)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

