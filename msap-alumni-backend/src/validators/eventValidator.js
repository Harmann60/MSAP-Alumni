import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(2, 'Event title must be at least 2 characters').max(200).trim(),
  category: z.string().min(2).max(50).trim().default('General'),
  dateDisplay: z.string().trim().optional(),
  date_display: z.string().trim().optional(),
  timeDisplay: z.string().trim().optional(),
  time_display: z.string().trim().optional(),
  location: z.string().min(1, 'Location or venue is required').max(200).trim(),
  description: z.string().min(1, 'Description is required').max(5000).trim(),
  isFeatured: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  registrationLink: z.string().trim().optional().nullable().or(z.literal('')),
  registration_link: z.string().trim().optional().nullable().or(z.literal('')),
});

export const updateEventSchema = createEventSchema.partial();

