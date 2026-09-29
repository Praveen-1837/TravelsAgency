import { z } from 'zod';

// Validates 10-digit Indian mobile number (optionally with +91 or leading 0)
const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const callbackRequestSchema = z.object({
  package_id: z.string().uuid().optional().nullable(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .trim()
    .refine((val) => indianMobileRegex.test(val.replace(/\s+/g, '')), {
      message: 'Please provide a valid 10-digit Indian mobile number starting with 6-9',
    })
    .transform((val) => {
      // Normalize to 10 digits
      const digitsOnly = val.replace(/\D/g, '');
      return digitsOnly.slice(-10);
    }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
  travel_from: z.string().optional().nullable(),
  travel_to: z.string().optional().nullable(),
  group_size: z
    .number()
    .int()
    .min(1, 'Group size must be at least 1')
    .max(100, 'Group size cannot exceed 100')
    .optional()
    .default(2),
  special_requests: z
    .string()
    .max(1000, 'Special requests cannot exceed 1000 characters')
    .optional()
    .nullable(),
  // Honeypot field for bot/spam prevention: must be empty
  website_hp: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
