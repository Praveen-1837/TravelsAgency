import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aarivavoyages.com';

export const metadata: Metadata = {
  title: 'Request Callback — Personalized Domestic Holiday Quotes',
  description:
    'Submit your travel dates and group preferences to get a customized, non-binding itinerary and price estimate from Aariva Voyages trip marshals within 2 hours.',
  alternates: {
    canonical: '/request-callback',
  },
  openGraph: {
    title: 'Request Callback | Aariva Voyages Custom Tour Concierge',
    description:
      'Get personalized domestic holiday itineraries & transparent quotes tailored to your budget and travel style.',
    url: `${baseUrl}/request-callback`,
    siteName: 'Aariva Voyages',
    type: 'website',
  },
};

export default function RequestCallbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
