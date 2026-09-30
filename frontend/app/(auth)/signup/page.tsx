import { Suspense } from 'react';
import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up | Aariva Voyages',
  description: 'Create your Aariva Voyages account to unlock exclusive domestic holiday packages & custom quotes.',
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
      <SignupForm />
    </Suspense>
  );
}
