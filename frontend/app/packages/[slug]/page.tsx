import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchPackageReviews } from '@/lib/api';
import PackageDetailClient from './PackageDetailClient';
import { PackagesListingContent } from '../PackagesListingContent';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PACKAGE_BY_SLUG_QUERY, ALL_PACKAGES_QUERY } from '@/sanity/lib/queries';
import { SanityPackage, SanityPackageSummary } from '@/sanity/lib/types';
import { mapSanityToPackage } from '@/sanity/lib/adapter';

const DESTINATIONS: Record<string, string> = {
  rajasthan: 'Rajasthan',
  kerala: 'Kerala',
  ladakh: 'Ladakh',
  kashmir: 'Kashmir',
  himachal: 'Himachal',
  goa: 'Goa',
  andaman: 'Andaman',
  'north-east': 'North East',
  uttarakhand: 'Uttarakhand',
  bali: 'Bali',
  dubai: 'Dubai',
  thailand: 'Thailand',
};

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aarivavoyages.com';

// ISR static params generation for fast loading and SEO
export async function generateStaticParams() {
  const pkgs = await sanityFetch<SanityPackageSummary[]>({ query: ALL_PACKAGES_QUERY, tags: ['package'] });
  return pkgs.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sanityPkg = await sanityFetch<SanityPackage>({ 
    query: PACKAGE_BY_SLUG_QUERY, 
    params: { slug },
    tags: [`package:${slug}`]
  });

  if (!sanityPkg) {
    const destName = DESTINATIONS[slug];
    return {
      title: destName ? `${destName} Tour Packages` : 'Package Not Found',
    };
  }

  const pkg = mapSanityToPackage(sanityPkg);
  const priceStr = `₹${pkg.price_per_person.toLocaleString('en-IN')}`;

  return {
    title: `${pkg.title} (${pkg.duration})`,
    description: `${pkg.description.slice(0, 155)}... Starting at ${priceStr}/${pkg.price_unit}. Custom domestic quotes with local marshals.`,
    alternates: {
      canonical: `/packages/${pkg.slug}`,
    },
    openGraph: {
      title: `${pkg.title} (${pkg.duration}) | ${priceStr}`,
      description: pkg.description.slice(0, 160),
      url: `${baseUrl}/packages/${pkg.slug}`,
      siteName: 'Aariva Voyages',
      type: 'website',
      images: pkg.images.length > 0 ? [{ url: pkg.images[0], alt: pkg.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.title} | ${priceStr}`,
      description: pkg.description.slice(0, 160),
      images: pkg.images.length > 0 ? [pkg.images[0]] : [],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const sanityPkg = await sanityFetch<SanityPackage>({ 
    query: PACKAGE_BY_SLUG_QUERY, 
    params: { slug },
    tags: [`package:${slug}`]
  });

  if (!sanityPkg) {
    if (DESTINATIONS[slug]) {
      // For /packages/kerala etc
      const allPkgs = await sanityFetch<SanityPackageSummary[]>({ query: ALL_PACKAGES_QUERY, tags: ['package'] });
      const mappedPackages = allPkgs.map(mapSanityToPackage);
      return (
        <React.Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading packages...</div>}>
          <PackagesListingContent destinationSlug={DESTINATIONS[slug]} destinationName={DESTINATIONS[slug]} initialPackages={mappedPackages} />
        </React.Suspense>
      );
    }
    notFound();
  }

  const pkg = mapSanityToPackage(sanityPkg);

  // Fetch package reviews for server rendering & SEO
  const reviewsRes = await fetchPackageReviews(slug);
  const initialReviews = reviewsRes?.data || [];

  // Similar packages (excluding current package)
  const allSanityPkgs = await sanityFetch<SanityPackageSummary[]>({ query: ALL_PACKAGES_QUERY, tags: ['package'] });
  const similarPackages = allSanityPkgs
    .filter((p) => p.slug !== pkg.slug)
    .map(mapSanityToPackage)
    .slice(0, 3);

  // TouristTrip JSON-LD Structured Data with Reviews & Breadcrumbs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        '@id': `${baseUrl}/packages/${pkg.slug}#trip`,
        name: pkg.title,
        description: pkg.description,
        touristType: pkg.audience,
        image: pkg.images,
        offers: {
          '@type': 'Offer',
          price: pkg.price_per_person,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/packages/${pkg.slug}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: pkg.rating_avg,
          reviewCount: pkg.review_count,
          bestRating: 5,
          worstRating: 1,
        },
        review: initialReviews.slice(0, 5).map((r) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: r.traveler_name,
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: r.rating,
            bestRating: 5,
          },
          reviewBody: r.comment,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Domestic Packages',
            item: `${baseUrl}/packages`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: pkg.title,
            item: `${baseUrl}/packages/${pkg.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageDetailClient
        pkg={pkg}
        similarPackages={similarPackages}
        initialReviews={initialReviews}
      />
    </>
  );
}
