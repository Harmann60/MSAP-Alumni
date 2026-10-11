/**
 * @fileoverview Zod validation schemas for Gallery routes.
 *
 * @module validators/galleryValidator
 */

import { z } from 'zod';

const ALLOWED_SOURCE_TYPES = ['VERCEL', 'SUPABASE', 'EXTERNAL'];
const ALLOWED_CATEGORIES   = ['General', 'Events', 'Cultural', 'Sports', 'Alumni', 'Academic', 'Community'];

export const createGalleryItemSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  caption: z.string().max(1000, 'Caption cannot exceed 1000 characters').optional().or(z.literal('')),
  imageUrl: z
    .string({ required_error: 'Image URL is required' })
    .url('imageUrl must be a valid URL')
    .max(1000, 'Image URL is too long'),
  sourceType: z
    .enum(ALLOWED_SOURCE_TYPES, {
      errorMap: () => ({ message: `sourceType must be one of: ${ALLOWED_SOURCE_TYPES.join(', ')}` }),
    })
    .default('SUPABASE'),
  category: z
    .enum(ALLOWED_CATEGORIES, {
      errorMap: () => ({ message: `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` }),
    })
    .default('General'),
  displayOrder: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? 0 : Number(val)),
      z.number().int().min(0).max(9999)
    )
    .default(0),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();
