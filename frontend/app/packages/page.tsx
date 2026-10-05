import React, { Suspense } from 'react';
import { PackagesListingContent } from './PackagesListingContent';
import { sanityFetch } from '@/sanity/lib/fetch';
import { ALL_PACKAGES_QUERY } from '@/sanity/lib/queries';
import { SanityPackageSummary } from '@/sanity/lib/types';
import { mapSanityToPackage } from '@/sanity/lib/adapter';

export default async function PackagesPage() {
  const sanityPkgs = await sanityFetch<SanityPackageSummary[]>({ query: ALL_PACKAGES_QUERY, tags: ['package'] });
  const mappedPackages = sanityPkgs.map(mapSanityToPackage);

  return (
    <Suspense
      fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading packages...</div>}
    >
      <PackagesListingContent initialPackages={mappedPackages} />
    </Suspense>
  );
}
