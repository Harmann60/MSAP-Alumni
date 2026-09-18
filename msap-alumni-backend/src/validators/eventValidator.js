import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  category: z.string().min(2).max(50).trim(),
  dateDisplay: z.string().min(2).max(50).trim(),
  timeDisplay: z.string().min(2).max(50).trim(),
  location: z.string().min(2).max(200).trim(),
  description: z.string().min(10).max(2000).trim(),
  isFeatured: z.boolean().default(false),
  registrationLink: z.string().url().optional().or(z.literal('')),
});
