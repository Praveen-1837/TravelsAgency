'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { fetchUserCallbacks } from '@/lib/api';
import { CallbackRecord } from '@/lib/types';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function BookingsPage() {
  const { user, session } = useAuth();
  const [callbacks, setCallbacks] = useState<CallbackRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session?.access_token) {
      setLoading(true);
      fetchUserCallbacks(session.access_token).then((data) => {
        setCallbacks(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [session]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return (
          <span
            style={{
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid #bfdbfe',
            }}
          >
            🔵 New
          </span>
        );
      case 'contacted':
        return (
          <span
            style={{
              backgroundColor: '#fff7ed',
              color: '#c2410c',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid #fed7aa',
            }}
          >
            📞 Contacted
          </span>
        );
      case 'converted':
        return (
          <span
            style={{
              backgroundColor: '#f0fdf4',
              color: '#15803d',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid #bbf7d0',
            }}
          >
            ✅ Confirmed
          </span>
        );
      case 'closed':
        return (
          <span
            style={{
              backgroundColor: '#f8fafc',
              color: '#64748b',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid #e2e8f0',
            }}
          >
            ⚪ Closed
          </span>
        );
      default:
        return (
          <span
            style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        backgroundColor: '#f8fafc',
        padding: '40px 16px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <RequireAuth>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '16px',
              }}
            >
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  My Bookings &amp; Inquiries
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                  Track your requested callback inquiries and trip statuses.
                </p>
              </div>
              <Link
                href="/packages"
                style={{
                  backgroundColor: '#ff5722',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Browse Packages
              </Link>
            </div>

            {/* Account Profile Summary */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#ff5722',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  {user?.user_metadata?.full_name || 'Traveler Account'}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{user?.email}</div>
              </div>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              My Callback Requests
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                Loading your callback inquiries...
              </div>
            ) : callbacks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📞</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  No callback requests yet
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                  When you request a callback on any package, your status will appear here.
                </p>
                <Link
                  href="/packages"
                  style={{
                    color: '#ff5722',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  Explore Domestic Tour Packages →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {callbacks.map((cb) => (
                  <div
                    key={cb.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Inquiry #{cb.id.substring(0, 8)}
                        </span>
                        {getStatusBadge(cb.status)}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        Phone: <strong>+91 {cb.phone}</strong> • Group: {cb.group_size || 2} Travelers
                      </div>
                      {cb.special_requests && (
                        <div style={{ fontSize: '13px', color: '#334155', marginTop: '6px', fontStyle: 'italic' }}>
                          &ldquo;{cb.special_requests}&rdquo;
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Requested on {new Date(cb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RequireAuth>
      </div>
    </div>
  );
}
