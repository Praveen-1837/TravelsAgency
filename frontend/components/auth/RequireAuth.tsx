'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  openCallbackOnLogin?: boolean;
}

import { LoginButton } from './LoginButton';

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallback,
  openCallbackOnLogin = true,
}) => {
  const { user, authLoading } = useAuth();
  const pathname = usePathname();

  if (authLoading) {
    return (
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
          Verifying account status...
        </p>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      style={{
        padding: '28px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#fff7ed',
          color: '#ff5722',
          fontSize: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
        }}
      >
        🔒
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
        Log in to Request a Callback
      </h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '18px', lineHeight: 1.5 }}>
        Please log in to your Aariva Voyages account to request a free callback &amp; custom itinerary quote.
      </p>
      <LoginButton openCallbackOnLogin={openCallbackOnLogin} />
    </div>
  );
};

