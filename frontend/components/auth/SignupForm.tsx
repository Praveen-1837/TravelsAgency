'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './auth.module.css';
import { supabase } from '@/lib/supabase/client';

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect away
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted && session?.user) {
        router.replace(returnTo);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [router, returnTo]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || undefined,
          },
        },
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message || 'Signup failed. Please try again.');
        return;
      }

      if (data.session) {
        // Immediate login session established
        router.push(returnTo);
      } else if (data.user) {
        setSuccessMsg(
          'Account created successfully! Please check your email inbox to confirm your email address.'
        );
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
                &ldquo;Join thousands of travelers exploring handcrafted itineraries across India.&rdquo;
              </p>
              <p className={styles.quoteAuthor}>— Aariva Voyages Community</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.authHeader}>
            <h1 className={styles.heading}>Create your account</h1>
            <p className={styles.subtext}>
              Join Aariva Voyages to unlock exclusive domestic tour deals &amp; personalized itineraries.
            </p>
          </div>

          {error && (
            <div id="signup-error-banner" className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {successMsg ? (
            <div className={styles.successBanner} role="status">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                Account Created!
              </h3>
              <p style={{ fontSize: '14px', color: '#166534', marginBottom: '16px' }}>
                {successMsg}
              </p>
              <Link href="/login" className={styles.footerLink} style={{ marginLeft: 0 }}>
                Go to Log in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="signup-name" className={styles.label}>
                  Full Name *
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-email" className={styles.label}>
                  Email address *
                </label>
                <input
                  id="signup-email"
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
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-phone" className={styles.label}>
                  Mobile Phone (Optional)
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-password" className={styles.label}>
                  Password *
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePasswordBtn}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-confirm-password" className={styles.label}>
                  Confirm Password *
                </label>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {!successMsg && (
            <p className={styles.footerText}>
              Already have an account?
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
