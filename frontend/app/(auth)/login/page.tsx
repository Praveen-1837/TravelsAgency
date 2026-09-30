import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginPage from '@/components/auth/login-page';

export const metadata: Metadata = {
  title: 'Log In | Aariva Voyages',
  description: 'Log in to your Aariva Voyages account to manage domestic package inquiries & bookings.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
