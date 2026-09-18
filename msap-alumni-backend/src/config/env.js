/**
 * @fileoverview Environment variable validation and parsing for the MSAP Alumni backend.
 *
 * Uses Zod to validate and coerce all environment variables at startup.
 * The process exits immediately (code 1) if any required variable is missing
 * or has an invalid value, preventing silent misconfiguration in production.
 *
 * Usage:
 *   import { env } from './config/env.js';
 *   console.log(env.PORT); // number — guaranteed to be set
 *
 * @module config/env
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file (no-op if already loaded or running in CI with real env vars)
dotenv.config();

/**
 * Zod schema defining all accepted environment variables, their types,
 * constraints, and default values.
 *
 * Defaults are chosen so the server starts cleanly in local development
 * even without a fully populated .env file.
 */
const envSchema = z.object({
  // ── Server ────────────────────────────────────────────────────────────────
  /** HTTP port the Express server will listen on. */
  PORT: z.coerce.number().default(5000),

  /** Execution environment. Controls security settings and log verbosity. */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** Allowed client origin for CORS. Set to your production frontend URL. */
  CLIENT_URL: z.string().default('http://localhost:5173'),

  // ── Supabase ──────────────────────────────────────────────────────────────
  /** Full Supabase project URL, e.g. https://abc123.supabase.co */
  SUPABASE_URL: z.string().optional().default(''),

  /** Supabase secret / service-role key (bypasses RLS). */
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  SUPABASE_SECRET_KEY: z.string().optional().default(''),

  /** Supabase publishable / anon public key. */
  SUPABASE_ANON_KEY: z.string().optional().default(''),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional().default(''),

  /** Optional Supabase JWKS URL for JWT verification. */
  SUPABASE_JWKS_URL: z.string().optional().default(''),

  // ── JWT / Authentication ──────────────────────────────────────────────────
  /**
   * Secret used to sign and verify JWT tokens.
   * Must be at least 16 characters; use a cryptographically random string in production.
   */
  JWT_SECRET: z.string().min(16).default('development_secret_key_msap_alumni_at_least_32_characters_long'),

  /** Short-lived access token expiry (e.g. "15m", "1h"). */
  JWT_EXPIRES_IN: z.string().default('15m'),

  /** Refresh token expiry (e.g. "7d", "30d"). */
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  /** Optional Google OAuth 2.0 Client ID for Sign-In with Google verification. */
  GOOGLE_CLIENT_ID: z.string().optional().default(''),

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  /** Rolling window duration in milliseconds for the global rate limiter. */
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),

  /** Max requests per IP per window for the global limiter. */
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  /** Max new registration submissions per IP per hour. */
  REGISTRATION_RATE_LIMIT_MAX: z.coerce.number().default(10),

  // ── Email / SMTP ──────────────────────────────────────────────────────────
  /** SMTP server hostname, e.g. "smtp.gmail.com". */
  SMTP_HOST: z.string().optional().default(''),

  /** SMTP server port. 587 = STARTTLS (recommended), 465 = SSL. */
  SMTP_PORT: z.coerce.number().optional().default(587),

  /** SMTP login username (usually the sending email address). */
  SMTP_USER: z.string().optional().default(''),

  /**
   * SMTP password or App Password (for Gmail with 2FA).
   * Generate at Google Account → Security → App Passwords.
   */
  SMTP_PASS: z.string().optional().default(''),

  /** "From" address shown to email recipients, e.g. 'MSAP Alumni <noreply@msap.org>'. */
  SMTP_FROM: z.string().optional().default('MSAP Alumni <noreply@msap.org>'),

  /** Email address that receives new-registration admin alerts. */
  NOTIFY_EMAIL: z.string().email().optional().default('alumni.msap1973@gmail.com'),

  /** Full URL of the admin dashboard, embedded as a CTA link in notification emails. */
  ADMIN_URL: z.string().optional().default('http://localhost:5173/admin'),

  // ── DKIM Signing (optional but strongly recommended for production) ────────
  /**
   * PEM-encoded RSA private key for DKIM signing.
   * Store newlines as `\n` in environment variable managers (e.g. Render secrets).
   * Generate with: openssl genrsa -out dkim-private.pem 2048
   */
  DKIM_PRIVATE_KEY: z.string().optional().default(''),

  /** The domain from which emails are sent, e.g. "msap.org". */
  DKIM_DOMAIN: z.string().optional().default(''),

  /**
   * DNS TXT record selector for DKIM, e.g. "mail".
   * The full DNS record name would be: mail._domainkey.msap.org
   */
  DKIM_KEY_SELECTOR: z.string().optional().default(''),

  // ── Email Test Mode ───────────────────────────────────────────────────────
  /**
   * Set to "true" to suppress all real email sends and log them to the console
   * instead. Useful for automated tests and CI environments.
   */
  EMAIL_TEST_MODE: z.string().optional().default('false'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables detected. Server cannot start.');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

/**
 * Validated, type-safe environment configuration object.
 * All fields are guaranteed to be present with correct types.
 *
 * @type {z.infer<typeof envSchema>}
 */
export const env = parsedEnv.data;
