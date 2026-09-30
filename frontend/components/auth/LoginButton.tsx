'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LoginButtonProps {
  openCallbackOnLogin?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ openCallbackOnLogin = false }) => {
  const pathname = usePathname();
  const returnParam = openCallbackOnLogin
    ? `${pathname}?openCallback=true`
    : pathname;
  const loginUrl = `/login?returnTo=${encodeURIComponent(returnParam)}`;

  return (
    <Link
      href={loginUrl}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff5722',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '15px',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(255, 87, 34, 0.25)',
        minHeight: '44px',
        width: '100%',
        maxWidth: '280px',
      }}
    >
      Login to Request Callback →
    </Link>
  );
};
