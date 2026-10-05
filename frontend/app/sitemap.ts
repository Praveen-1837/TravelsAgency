import { MetadataRoute } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { ALL_PACKAGES_QUERY } from '@/sanity/lib/queries';
import { SanityPackageSummary } from '@/sanity/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aarivavoyages.com';

  const pkgs = await sanityFetch<SanityPackageSummary[]>({ query: ALL_PACKAGES_QUERY, tags: ['package'] });

  const packageRoutes: MetadataRoute.Sitemap = pkgs.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/request-callback`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...packageRoutes];
}
