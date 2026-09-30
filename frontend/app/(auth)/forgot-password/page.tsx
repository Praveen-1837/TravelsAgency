import { Metadata } from 'next';
import ForgotPasswordPage from '@/components/auth/forgot-password-page';

export const metadata: Metadata = {
  title: 'Forgot Password | Aariva Voyages',
  description: 'Reset your Aariva Voyages account password.',
};

export default function Page() {
  return <ForgotPasswordPage />;
}
