import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: 'var(--secondary)',
  width: 'device-width',
  initialScale: 1,
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aarivavoyages.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Aariva Voyages — Curated Domestic Tour Packages across India',
    template: '%s | Aariva Voyages',
  },
  description:
    'Experience extraordinary domestic journeys across India. Handcrafted honeymoon escapes, family expeditions, and luxury island retreats in Sikkim, Meghalaya, Andaman, Lakshadweep & Kashmir.',
  keywords: [
    'domestic tour packages india',
    'best travel agency india',
    'sikkim darjeeling tour packages',
    'meghalaya road trip',
    'andaman honeymoon trip',
    'kashmir houseboat package',
    'lakshadweep coral tour',
    'aariva voyages',
  ],
  authors: [{ name: 'Aariva Voyages', url: baseUrl }],
  creator: 'Aariva Voyages',
  publisher: 'Aariva Voyages',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Aariva Voyages — Curated Domestic Tour Packages across India',
    description:
      'Handcrafted domestic holiday packages with transparent custom quotes, 4.9★ verified traveler reviews, and dedicated local trip marshals.',
    url: baseUrl,
    siteName: 'Aariva Voyages',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Aariva Voyages Domestic Tour Packages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aariva Voyages — Curated Domestic Tour Packages',
    description:
      'Inquiry-based domestic holiday packages with 24x7 local trip marshals and zero hidden fees.',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  alternates: {
    canonical: '/',
  },
};

import { CountryProvider } from '@/context/CountryContext';
import { AuthProvider } from '@/lib/auth/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Aariva Voyages',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    '@id': baseUrl,
    url: baseUrl,
    telephone: '+919876543210',
    priceRange: '₹14,999 - ₹89,999',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Outer Ring Road, Indiranagar',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560038',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9716,
      longitude: 77.5946,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '21:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '480',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <CountryProvider>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </CountryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


