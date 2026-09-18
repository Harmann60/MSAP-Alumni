import { z } from 'zod';
import { ALUMNI_STATUS } from '../constants/roles.js';

export const registerAlumniSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(30, 'Phone number cannot exceed 30 characters')
    .optional()
    .or(z.literal('')),
  puneCollege: z
    .string()
    .max(150, 'College name cannot exceed 150 characters')
    .optional()
    .or(z.literal('')),
  batchYear: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({ invalid_type_error: 'Batch year must be a valid number' })
        .int('Batch year must be an integer')
        .min(1970, 'Batch year must be 1970 or later')
        .max(new Date().getFullYear() + 5, 'Batch year is invalid')
        .optional()
    ),
  currentLocation: z
    .string()
    .max(150, 'Location cannot exceed 150 characters')
    .optional()
    .or(z.literal('')),
  profession: z
    .string()
    .max(200, 'Profession cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .optional(),
  // Anti-Spam Honeypot field (must be empty from legitimate UI forms)
  hp_website: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export const updateAlumniStatusSchema = z.object({
  status: z.enum([ALUMNI_STATUS.PENDING, ALUMNI_STATUS.VERIFIED, ALUMNI_STATUS.REJECTED]),
  adminNotes: z.string().max(1000).optional().nullable(),
});

export const updateAlumniProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).trim().optional(),
  email: z.string().email('Valid email required').toLowerCase().trim().optional(),
  phone: z.string().max(30).optional().nullable().or(z.literal('')),
  puneCollege: z.string().max(150).optional().nullable().or(z.literal('')),
  batchYear: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
      z
        .number({ invalid_type_error: 'Batch year must be a valid number' })
        .int('Batch year must be an integer')
        .min(1970, 'Batch year must be 1970 or later')
        .max(new Date().getFullYear() + 5, 'Batch year is invalid')
        .optional()
        .nullable()
    ),
  currentLocation: z.string().max(150).optional().nullable().or(z.literal('')),
  profession: z.string().max(200).optional().nullable().or(z.literal('')),
  status: z.enum([ALUMNI_STATUS.PENDING, ALUMNI_STATUS.VERIFIED, ALUMNI_STATUS.REJECTED]).optional(),
  adminNotes: z.string().max(1000).optional().nullable(),
});
