import { SanityPackage, SanityPackageSummary } from './types';
import { urlFor } from './image';
import { Package } from '@/lib/types';

export function mapSanityToPackage(pkg: SanityPackageSummary | SanityPackage): Package {
  const images: string[] = [];
  if (pkg.mainImage) {
    images.push(urlFor(pkg.mainImage).url());
  }
  if ((pkg as SanityPackage).gallery) {
    (pkg as SanityPackage).gallery!.forEach(img => images.push(urlFor(img).url()));
  }

  // Parse duration string "5 Days / 4 Nights" to days (approx)
  let duration_days = 0;
  if (pkg.duration) {
    const match = pkg.duration.match(/(\d+)\s*Day/i);
    if (match) duration_days = parseInt(match[1]);
    else duration_days = parseInt(pkg.duration) || 0;
  }

  const audience: string[] = [];
  if (pkg.category) {
    audience.push(pkg.category.toLowerCase());
  }

  const itins = (pkg as SanityPackage).itinerary || [];

  return {
    id: pkg._id,
    slug: pkg.slug,
    title: pkg.title,
    destination: pkg.destination || '',
    duration_days: duration_days,
    duration_nights: duration_days > 0 ? duration_days - 1 : 0,
    duration: pkg.duration || '',
    price_per_person: pkg.price || 0,
    price_unit: 'person',
    audience,
    description: pkg.shortDescription || '',
    inclusions: (pkg as SanityPackage).inclusions || [],
    itinerary: itins.map(i => ({
      day: i.dayNumber,
      title: i.title,
      description: i.description
    })),
    images,
    is_featured: pkg.featured || false,
    is_active: true,
  };
}
