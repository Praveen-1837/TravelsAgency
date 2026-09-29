import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchPackageBySlug, fetchPackageReviews } from '@/lib/api';
import { LOCAL_SEED_PACKAGES } from '@/lib/seed-data';
import PackageDetailClient from './PackageDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aarivavoyages.com';

// ISR static params generation for fast loading and SEO
export async function generateStaticParams() {
  return LOCAL_SEED_PACKAGES.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);

  if (!pkg) {
    return {
      title: 'Package Not Found',
    };
  }

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
  const pkg = await fetchPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  // Fetch package reviews for server rendering & SEO
  const reviewsRes = await fetchPackageReviews(slug);
  const initialReviews = reviewsRes?.data || [];

  // Similar packages (excluding current package)
  const similarPackages = LOCAL_SEED_PACKAGES.filter((p) => p.slug !== pkg.slug).slice(0, 3);

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
