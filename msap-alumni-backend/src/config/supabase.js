/**
 * @fileoverview Supabase client initialisation for the MSAP Alumni backend.
 *
 * Creates a singleton Supabase client using the service-role key, which bypasses
 * Row Level Security (RLS) — appropriate for server-side admin operations.
 *
 * If Supabase credentials are not configured in the environment (e.g. during
 * local development), `supabase` is exported as `null` and `isConfigured`
 * is `false`. All service layers handle this case by falling back to in-memory
 * mock data, allowing the backend to run without a database connection.
 *
 * @module config/supabase
 */

import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from './logger.js';

// ─── Readiness check ──────────────────────────────────────────────────────────

/**
 * True when a valid Supabase URL and at least one API key are present.
 *
 * @type {boolean}
 */
const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  env.NODE_ENV !== 'test' &&
  env.SUPABASE_URL &&
  env.SUPABASE_URL.trim().startsWith('http') &&
  (secretKey || publishableKey)
);

// ─── Client creation ──────────────────────────────────────────────────────────

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let supabaseClient = null;

if (isSupabaseConfigured) {
  /**
   * Prefer the secret / service-role key for server-side operations as it bypasses RLS.
   * Fall back to the publishable / anon key if the secret key is not set.
   */
  const key = secretKey || publishableKey;

  supabaseClient = createClient(env.SUPABASE_URL, key, {
    auth: {
      /** Disable session persistence — the backend is stateless. */
      persistSession: false,
      /** Disable token auto-refresh — handled manually if needed. */
      autoRefreshToken: false,
    },
  });

  logger.info(`Connected to Supabase PostgreSQL: ${env.SUPABASE_URL}`);
} else {
  logger.warn(
    'Supabase credentials not configured in .env. ' +
    'Running with in-memory mock data for local development.'
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

/**
 * Initialised Supabase client, or `null` if credentials are not configured.
 * Always check `isConfigured` before using this client.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
export const supabase = supabaseClient;

/**
 * Whether the Supabase client was successfully initialised.
 * Use this flag in service layers to switch between real DB and mock data.
 *
 * @type {boolean}
 */
export const isConfigured = isSupabaseConfigured;
