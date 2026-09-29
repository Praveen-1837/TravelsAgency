import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aarivavoyages.com';

export const metadata: Metadata = {
  title: 'Domestic Holiday Packages & Expeditions across India',
  description:
    'Browse hand-crafted domestic tour packages for Sikkim, Darjeeling, Meghalaya, Andaman Islands, Lakshadweep & Kashmir Valley. Transparent quotes and local trip marshals.',
  alternates: {
    canonical: '/packages',
  },
  openGraph: {
    title: 'India Domestic Tour Packages & Expeditions | Aariva Voyages',
    description:
      'Browse hand-crafted domestic tour packages with transparent pricing, 4.9★ reviews, and 24x7 trip marshals.',
    url: `${baseUrl}/packages`,
    siteName: 'Aariva Voyages',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Aariva Voyages Packages Catalog',
      },
    ],
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
