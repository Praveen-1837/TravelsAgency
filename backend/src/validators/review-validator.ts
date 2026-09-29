import { z } from 'zod';

export const createReviewSchema = z.object({
  traveler_name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters').max(2000).trim(),
  photos: z.array(z.string().url('Invalid photo URL')).optional().default([]),
  trip_label: z.string().max(100).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
