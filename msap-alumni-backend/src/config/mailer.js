/**
 * @fileoverview Nodemailer transport configuration for the MSAP Alumni platform.
 *
 * Features:
 *  - SMTP transport with STARTTLS (port 587) or SSL (port 465)
 *  - DKIM signing (optional) — set DKIM_PRIVATE_KEY, DKIM_DOMAIN, DKIM_KEY_SELECTOR in .env
 *  - Automatic retry with exponential back-off (up to 3 attempts)
 *  - Test / development mode — prints email content to the logger instead of sending
 *  - Graceful degradation — if SMTP credentials are missing, falls back to dev-console mode
 *
 * Required env vars for real sending:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Optional env vars for DKIM signing:
 *   DKIM_PRIVATE_KEY  — PEM-encoded RSA private key (newlines as \n)
 *   DKIM_DOMAIN       — e.g. "msap.org"
 *   DKIM_KEY_SELECTOR — e.g. "mail" (matches DNS TXT record: mail._domainkey.msap.org)
 *
 * @module config/mailer
 */

import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from './logger.js';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum number of delivery attempts before giving up. */
const MAX_RETRIES = 3;

/** Base delay (ms) for exponential back-off between retries. */
const RETRY_BASE_DELAY_MS = 500;

// ─── SMTP readiness check ─────────────────────────────────────────────────────

/**
 * True when all required SMTP credentials are present in the environment.
 * The check for a placeholder value prevents accidental sends with the default
 * template values from `.env.example`.
 *
 * @type {boolean}
 */
const isSmtpConfigured = Boolean(
  env.SMTP_HOST &&
  env.SMTP_USER &&
  env.SMTP_PASS &&
  env.SMTP_USER !== 'your.gmail@gmail.com' &&
  env.SMTP_PASS !== 'your_16char_app_password'
);

/**
 * True when DKIM signing is fully configured.
 * All three environment variables must be non-empty.
 *
 * @type {boolean}
 */
const isDkimConfigured = Boolean(
  env.DKIM_PRIVATE_KEY &&
  env.DKIM_DOMAIN &&
  env.DKIM_KEY_SELECTOR
);

// ─── Transporter creation ─────────────────────────────────────────────────────

/** @type {import('nodemailer').Transporter | null} */
let transporter = null;

if (isSmtpConfigured) {
  /**
   * DKIM options injected into the transport when all three DKIM env vars are
   * present. The private key supports both escaped `\n` (common in CI secrets)
   * and real newlines.
   *
   * @type {import('nodemailer').DkimOptions | undefined}
   */
  const dkim = isDkimConfigured
    ? {
        domainName: env.DKIM_DOMAIN,
        keySelector: env.DKIM_KEY_SELECTOR,
        // Support escaped newlines stored in environment variable managers
        privateKey: env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    : undefined;

  if (isDkimConfigured) {
    logger.info(`DKIM signing enabled (domain: ${env.DKIM_DOMAIN}, selector: ${env.DKIM_KEY_SELECTOR})`);
  } else {
    logger.warn('DKIM signing is NOT configured. Emails will be sent without a DKIM signature. Set DKIM_PRIVATE_KEY, DKIM_DOMAIN, and DKIM_KEY_SELECTOR in .env to enable.');
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    /** Use SSL (port 465) or STARTTLS (port 587). */
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    tls: {
      /** Enforce strict TLS certificate validation in production. */
      rejectUnauthorized: env.NODE_ENV === 'production',
    },
    dkim,
  });

  // Verify connection on startup so misconfigurations are caught immediately.
  transporter.verify((error) => {
    if (error) {
      logger.warn(
        'SMTP transporter verification failed. Emails will fall back to console logging.',
        { error: error.message }
      );
      // Nullify so sendMail automatically uses the dev-console fallback.
      transporter = null;
    } else {
      logger.info(`SMTP mailer ready — ${env.SMTP_HOST}:${env.SMTP_PORT}${isDkimConfigured ? ' (DKIM ✓)' : ''}`);
    }
  });
} else {
  logger.warn(
    'SMTP credentials not configured in .env. ' +
    'All emails will be printed to the logger (dev mode). ' +
    'Set SMTP_HOST, SMTP_USER, and SMTP_PASS to enable real sending.'
  );
}

// ─── Retry helper ────────────────────────────────────────────────────────────

/**
 * Executes an async function up to `maxAttempts` times, waiting an
 * exponentially increasing delay between each failed attempt.
 *
 * @template T
 * @param {() => Promise<T>} fn          - The async function to execute.
 * @param {number}           maxAttempts - Maximum number of attempts.
 * @param {number}           baseDelayMs - Initial back-off delay in milliseconds.
 * @returns {Promise<T>} The resolved value from the first successful attempt.
 * @throws {Error} Re-throws the last error after all attempts are exhausted.
 */
async function withRetry(fn, maxAttempts = MAX_RETRIES, baseDelayMs = RETRY_BASE_DELAY_MS) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt < maxAttempts) {
        const delay = baseDelayMs * 2 ** (attempt - 1); // 500ms, 1000ms, 2000ms
        logger.warn(`Email send attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay}ms…`, {
          error: err.message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sends an email via the configured SMTP transporter.
 *
 * Behaviour matrix:
 * | Condition                      | Behaviour                                      |
 * |--------------------------------|------------------------------------------------|
 * | SMTP configured, test mode off | Sends real email; retries up to 3× on failure  |
 * | SMTP configured, test mode on  | Prints email to logger; does NOT send           |
 * | SMTP not configured            | Prints email to logger; does NOT send           |
 *
 * @param {import('nodemailer').SendMailOptions} mailOptions
 *   Standard Nodemailer mail options (to, subject, html, text, …).
 *   The `from` field defaults to `env.SMTP_FROM` if not provided.
 *
 * @returns {Promise<{ messageId: string, devMode?: boolean, testMode?: boolean }>}
 *   Nodemailer info object on success, or a mock object in dev/test mode.
 *
 * @throws {Error} Only if the SMTP transporter is live and all retry attempts fail.
 */
export async function sendMail(mailOptions) {
  const fullOptions = {
    from: env.SMTP_FROM,
    ...mailOptions,
  };

  // ── Test / dev-console mode ──────────────────────────────────────────────
  const isTestMode = env.EMAIL_TEST_MODE === 'true' || env.NODE_ENV === 'test';

  if (isTestMode) {
    logger.info('📧 [TEST MODE — email NOT sent] ────────────────────────────');
    logger.info(`  To:      ${fullOptions.to}`);
    logger.info(`  From:    ${fullOptions.from}`);
    logger.info(`  Subject: ${fullOptions.subject}`);
    logger.info('────────────────────────────────────────────────────────────');
    return { messageId: `test-${Date.now()}@msap.local`, testMode: true };
  }

  // ── Real SMTP send with retry ────────────────────────────────────────────
  if (transporter) {
    const info = await withRetry(() => transporter.sendMail(fullOptions));
    logger.info(`Email sent: ${info.messageId} → ${fullOptions.to}`);
    return info;
  }

  // ── Dev-console fallback (SMTP not configured) ───────────────────────────
  logger.info('📧 [DEV EMAIL — not actually sent] ────────────────────────────');
  logger.info(`  To:      ${fullOptions.to}`);
  logger.info(`  From:    ${fullOptions.from}`);
  logger.info(`  Subject: ${fullOptions.subject}`);
  logger.info('  (HTML body omitted — configure SMTP_HOST/SMTP_USER/SMTP_PASS to send real emails)');
  logger.info('────────────────────────────────────────────────────────────────');
  return { messageId: 'dev-console-fallback', devMode: true };
}

// ─── Exports ─────────────────────────────────────────────────────────────────

/**
 * Whether a valid SMTP transporter has been initialised.
 * Useful for health-check endpoints and conditional logic.
 *
 * @type {boolean}
 */
export { isSmtpConfigured, isDkimConfigured };
