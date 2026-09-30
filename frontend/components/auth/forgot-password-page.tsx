'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './auth.module.css';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your account email address.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setLoading(false);

      if (resetError) {
        setError(resetError.message || 'Failed to send password reset email. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('A network error occurred. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        {/* Left Hero Banner Panel */}
        <div className={styles.leftPanel}>
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
            alt="Scenic India domestic travel"
            fill
            priority
            className={styles.bgImage}
          />
          <div className={styles.panelOverlay}>
            <div className={styles.brandBadge}>
              <span>🏔️</span> Aariva Voyages
            </div>
            <div className={styles.quoteBox}>
              <p className={styles.quoteText}>
                &ldquo;Account security &amp; transparent communication are our top priorities.&rdquo;
              </p>
              <p className={styles.quoteAuthor}>— Aariva Voyages Support Team</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.authHeader}>
            <h1 className={styles.heading}>Reset your password</h1>
            <p className={styles.subtext}>
              Enter your registered email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div id="forgot-error-banner" className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {success ? (
            <div className={styles.successBanner} role="status">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                Check your email for a reset link
              </h3>
              <p style={{ fontSize: '14px', color: '#166534', marginBottom: '16px' }}>
                We&apos;ve sent instructions to <strong>{email}</strong>. Please click the link inside to set a new password.
              </p>
              <Link href="/login" className={styles.footerLink} style={{ marginLeft: 0 }}>
                ← Return to Log in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="forgot-email" className={styles.label}>
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'forgot-error-banner' : undefined}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          )}

          {!success && (
            <p className={styles.footerText}>
              Remembered your password?
              <Link href="/login" className={styles.footerLink}>
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
