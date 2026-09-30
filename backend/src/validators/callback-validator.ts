import { z } from 'zod';

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
      const digitsOnly = val.replace(/\D/g, '');
      return digitsOnly.slice(-10);
    }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
  travel_from: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(d.getTime()) && d >= today;
      },
      { message: 'Travel start date cannot be in the past' }
    ),
  travel_to: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(d.getTime()) && d >= today;
      },
      { message: 'Return date cannot be in the past' }
    ),
  group_size: z
    .number()
    .int()
    .min(1, 'Group size must be at least 1')
    .max(50, 'Group size cannot exceed 50')
    .optional()
    .default(2),
  special_requests: z
    .string()
    .max(500, 'Special requests cannot exceed 500 characters')
    .optional()
    .nullable(),
  website_hp: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
