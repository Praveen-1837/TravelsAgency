'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './CallbackForm.module.css';
import { submitCallbackInquiry } from '@/lib/api';
import { gsap, useGSAP } from '@/lib/gsap';
import { useAuth } from '@/lib/auth/AuthContext';
import { RequireAuth } from '../auth/RequireAuth';

interface CallbackFormProps {
  packageId?: string | null;
  packageTitle?: string;
  defaultDate?: string;
  defaultGroupSize?: number;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const CallbackForm: React.FC<CallbackFormProps & { packageSlug?: string }> = ({
  packageId,
  packageSlug,
  packageTitle,
  defaultDate = '',
  defaultGroupSize = 2,
  onSuccess,
  title = 'Request a Free Callback',
  subtitle = 'Share your travel preferences and our destination specialist will contact you with customized options.',
}) => {
  const { user, session } = useAuth();

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Prefill user details when logged in
  useEffect(() => {
    if (user) {
      if (user.user_metadata?.full_name && !name) {
        setName(user.user_metadata.full_name);
      }
      if (user.email && !email) {
        setEmail(user.email);
      }
      if (user.user_metadata?.phone && !phone) {
        setPhone(user.user_metadata.phone);
      }
    }
  }, [user, name, email, phone]);

  // Field refs for CustomWiggle shake & accessibility focus
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const travelFromRef = useRef<HTMLInputElement>(null);
  const travelToRef = useRef<HTMLInputElement>(null);

  // Confirmation panel refs
  const panelRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (success && panelRef.current) {
      panelRef.current.focus();
    }
  }, [success]);

  // GSAP animations for success removed in favor of CSS fade-in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    if (!user) {
      setError('Please log in to submit a callback request.');
      return;
    }

    setError(null);
    setFieldErrors({});

    const newFieldErrors: Record<string, string> = {};
    const invalidEls: HTMLElement[] = [];

    // 1. Name validation
    if (!name.trim()) {
      newFieldErrors.name = 'Full name is required.';
      if (nameRef.current) invalidEls.push(nameRef.current);
    }

    // 2. Phone validation (10-digit Indian starting 6-9)
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

    // 4. Travel dates validation
    if (travelFrom && travelTo && travelTo < travelFrom) {
      newFieldErrors.travelTo = 'Return date cannot be earlier than departure date.';
      if (travelToRef.current) invalidEls.push(travelToRef.current);
    }

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

    try {
      const res = await submitCallbackInquiry(
        {
          package_id: packageId,
          package_slug: packageSlug,
          package_title: packageTitle,
          name,
          phone: cleanPhone,
          email: email || undefined,
          travel_from: travelFrom || undefined,
          travel_to: travelTo || undefined,
          group_size: Number(groupSize),
          special_requests: specialRequests || undefined,
          website_hp: honeypot,
        },
        session?.access_token
      );

      setLoading(false);

      if (res.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        if (res.error?.includes('401') || res.error?.includes('UNAUTHORIZED')) {
          localStorage.setItem(
            'callback_draft',
            JSON.stringify({ name, phone, email, travelFrom, travelTo, groupSize, specialRequests })
          );
          setError('Session expired. Please log in again to complete your request.');
        } else {
          setError(res.error || 'Failed to submit request. Please try again or call our helpline.');
        }
      }
    } catch {
      setLoading(false);
      setError('Network connection error. Please try again.');
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setTravelFrom('');
    setTravelTo('');
    setSpecialRequests('');
    setFieldErrors({});
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        aria-live="polite"
        className={styles.successContainer}
      >
        <div className={styles.successIconWrapper}>
          <svg
            className={styles.successCheckmark}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 className={styles.successTitle}>Inquiry Registered!</h3>
        <p className={styles.successSubtitle}>
          Our team will contact you shortly
        </p>

        <button type="button" onClick={handleReset} className={styles.anotherBtn}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <RequireAuth>
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

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                ref={nameRef}
                id="full-name"
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
                aria-describedby={fieldErrors.name ? 'full-name-error' : undefined}
              />
              {fieldErrors.name && (
                <p id="full-name-error" className={styles.fieldErrorMsg} role="alert">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="mobile-number">10-Digit Mobile Number *</label>
              <div className={`${styles.phoneWrapper} ${fieldErrors.phone ? styles.inputError : ''}`}>
                <span className={styles.prefix}>+91</span>
                <input
                  ref={phoneRef}
                  id="mobile-number"
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? 'mobile-number-error' : undefined}
                />
              </div>
              {fieldErrors.phone && (
                <p id="mobile-number-error" className={styles.fieldErrorMsg} role="alert">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div className={styles.gridRow}>
            <div className={styles.field}>
              <label htmlFor="email-address">Email Address (Optional)</label>
              <input
                ref={emailRef}
                id="email-address"
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={fieldErrors.email ? styles.inputError : ''}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-address-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-address-error" className={styles.fieldErrorMsg} role="alert">
                  {fieldErrors.email}
                </p>
              )}
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
                ref={travelFromRef}
                id="travel-from"
                type="date"
                value={travelFrom}
                onChange={(e) => setTravelFrom(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="travel-to">Return Date (Optional)</label>
              <input
                ref={travelToRef}
                id="travel-to"
                type="date"
                value={travelTo}
                onChange={(e) => {
                  setTravelTo(e.target.value);
                  if (fieldErrors.travelTo) setFieldErrors((prev) => ({ ...prev, travelTo: '' }));
                }}
                className={fieldErrors.travelTo ? styles.inputError : ''}
                aria-invalid={!!fieldErrors.travelTo}
                aria-describedby={fieldErrors.travelTo ? 'travel-to-error' : undefined}
              />
              {fieldErrors.travelTo && (
                <p id="travel-to-error" className={styles.fieldErrorMsg} role="alert">
                  {fieldErrors.travelTo}
                </p>
              )}
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
      </RequireAuth>
    </div>
  );
};
