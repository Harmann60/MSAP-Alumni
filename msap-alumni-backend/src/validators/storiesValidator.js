/**
 * @fileoverview Zod validation schemas for Stories / Articles routes.
 *
 * @module validators/storiesValidator
 */

import { z } from 'zod';

const ALLOWED_CATEGORIES = [
  'Spotlight', 'Career', 'Community', 'Cultural', 'Sports', 'Achievement', 'Research', 'Alumni'
];

export const createStorySchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title cannot exceed 255 characters')
    .trim(),
  source: z
    .string({ required_error: 'Source is required' })
    .min(2, 'Source must be at least 2 characters')
    .max(100, 'Source cannot exceed 100 characters')
    .trim(),
  publishedDate: z
    .string({ required_error: 'Published date is required' })
    .min(2, 'Published date is required')
    .max(50)
    .trim(),
  imageUrl: z
    .string({ required_error: 'Image URL is required' })
    .url('imageUrl must be a valid URL')
    .max(500, 'Image URL is too long'),
  excerpt: z
    .string({ required_error: 'Excerpt is required' })
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt cannot exceed 500 characters')
    .trim(),
  category: z
    .enum(ALLOWED_CATEGORIES, {
      errorMap: () => ({ message: `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` }),
    })
    .default('Spotlight'),
  content: z.string().max(50000, 'Content cannot exceed 50,000 characters').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
});

export const updateStorySchema = createStorySchema.partial();
