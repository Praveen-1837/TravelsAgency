import { z } from 'zod';

export const packageQuerySchema = z.object({
  destination: z.string().optional(),
  audience: z.enum(['couple', 'group', 'family']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  duration: z.coerce.number().min(1).optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'rating', 'duration', 'popular'])
    .optional()
    .default('popular'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(12),
});

export const createPackageSchema = z.object({
  slug: z.string().min(2).max(100),
  title: z.string().min(3).max(200),
  destination: z.string().min(2).max(100),
  duration_days: z.number().int().min(1),
  duration_nights: z.number().int().min(0),
  price_per_person: z.number().min(0),
  price_unit: z.enum(['person', 'couple']).default('person'),
  audience: z.array(z.string()).default(['couple', 'group', 'family']),
  description: z.string().min(10),
  inclusions: z.array(z.string()).default([]),
  itinerary: z.any().default([]),
  images: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const updatePackageSchema = createPackageSchema.partial();
