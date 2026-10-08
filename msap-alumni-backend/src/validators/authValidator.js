import { z } from 'zod';

/**
 * Password complexity regex: at least one uppercase, one lowercase,
 * one digit, and one special character. Min 8 characters.
 */
const passwordComplexity = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  // Login schema accepts any non-empty password (we validate complexity only at registration)
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const googleLoginSchema = z.object({
  credential: z
    .string({ required_error: 'Google ID token credential is required' })
    .min(10, 'Google ID token credential is required'),
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  picture: z.string().optional(),
});

export const setAlumniPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: passwordComplexity,
  token: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Reset token is required' })
    .min(10, 'Invalid or malformed reset token'),
  password: passwordComplexity,
});
