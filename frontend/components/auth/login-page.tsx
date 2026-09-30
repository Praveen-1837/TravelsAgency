'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './auth.module.css';
import { supabase } from '@/lib/supabase';

// Flag to toggle Google OAuth button when configured in Supabase
const SHOW_GOOGLE_AUTH = false;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in, redirect away if so
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Your email address has not been confirmed yet. Please check your inbox.');
        } else {
          setError(authError.message || 'Login failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(returnTo);
      }
    } catch {
      setError('A network error occurred. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });
    } catch {
      setError('Could not connect to Google. Please try again.');
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
                &ldquo;Seamless domestic trips across Sikkim, Meghalaya &amp; Andaman with zero hidden fees.&rdquo;
              </p>
              <p className={styles.quoteAuthor}>— Over 4.9★ from 4,200+ Verified Travelers</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.authHeader}>
            <h1 className={styles.heading}>Welcome back</h1>
            <p className={styles.subtext}>
              Log in to your Aariva Voyages account to manage your bookings &amp; saved packages.
            </p>
          </div>

          {/* Optional Google OAuth Button */}
          {SHOW_GOOGLE_AUTH && (
            <>
              <button type="button" onClick={handleGoogleLogin} className={styles.googleBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>
              <div className={styles.divider}>
                <span className={styles.dividerSpan}>or continue with email</span>
              </div>
            </>
          )}

          {/* Inline Error Message */}
          {error && (
            <div id="login-error-banner" className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>
                Email address
              </label>
              <input
                id="login-email"
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
                aria-describedby={error ? 'login-error-banner' : undefined}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="login-password" className={styles.label}>
                  Password
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <div className={styles.inputWrapper}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'login-error-banner' : undefined}
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

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className={styles.footerText}>
            New to Aariva Voyages?
            <Link href="/signup" className={styles.footerLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
