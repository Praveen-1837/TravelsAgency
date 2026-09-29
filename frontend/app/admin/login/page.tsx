'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await adminLogin(email, password);
    setLoading(false);

    if (res.success && res.token) {
      localStorage.setItem('aariva_admin_token', res.token);
      localStorage.setItem('aariva_admin_user', JSON.stringify(res.user));
      document.cookie = `aariva_admin_token=${res.token}; path=/; max-age=86400`;
      router.push('/admin');
    } else {
      setErrorMsg(res.error || 'Invalid email or password.');
    }
  };

  const fillDemo = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      setEmail('admin@aarivavoyages.com');
      setPassword('admin123');
    } else {
      setEmail('staff@aarivavoyages.com');
      setPassword('staff123');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <Image
            src="/images/logo.png"
            alt="Aariva Voyages"
            width={160}
            height={50}
            className={styles.logoImage}
            priority
          />
          <span className={styles.portalBadge}>STAFF PORTAL</span>
          <h1 className={styles.title}>Admin Sign In</h1>
          <p className={styles.subtitle}>
            Manage callback inquiries, packages, and traveler reviews.
          </p>
        </div>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="admin-email">Staff Email Address</label>
            <input
              id="admin-email"
              type="email"
              className={styles.input}
              placeholder="e.g. admin@aarivavoyages.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <div className={styles.demoBox}>
          <span className={styles.demoTitle}>Demo Quick-Fill Credentials:</span>
          <div className={styles.demoButtonsRow}>
            <button type="button" className={styles.demoChip} onClick={() => fillDemo('admin')}>
              👑 Operations Admin
            </button>
            <button type="button" className={styles.demoChip} onClick={() => fillDemo('staff')}>
              🛡️ Travel Marshal
            </button>
          </div>
        </div>

        <Link href="/" className={styles.returnHomeLink}>
          ← Back to Aariva Voyages public site
        </Link>
      </div>
    </div>
  );
}
