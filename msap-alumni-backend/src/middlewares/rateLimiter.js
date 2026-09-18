/**
 * @fileoverview Rate-limiting and brute-force protection middleware for the MSAP Alumni API.
 *
 * Three distinct limiters are exported, each tuned for a different threat surface:
 *
 * | Limiter              | Window    | Max requests | Usage                            |
 * |----------------------|-----------|--------------|----------------------------------|
 * | `globalLimiter`      | 15 min    | 100 (env)    | All `/api/*` routes              |
 * | `registrationLimiter`| 1 hour    | 5 (env)      | `POST /alumni/register`          |
 * | `authLimiter`        | 15 min    | 5 (prod)/50  | Login & alumni-login routes      |
 * | `authSlowDown`       | 15 min    | progressive  | Applied alongside `authLimiter`  |
 *
 * @module middlewares/rateLimiter
 */

import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { env } from '../config/env.js';

// ─── Global API limiter ───────────────────────────────────────────────────────

/**
 * Broad rate limiter applied to every `/api/*` route.
 *
 * Protects the API from general abuse and DDoS amplification.
 * Limits are configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`
 * environment variables to allow tuning without code changes.
 *
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  /** Use the standardised RateLimit-* headers (RFC 6585 draft). */
  standardHeaders: true,
  /** Suppress the deprecated X-RateLimit-* headers. */
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// ─── Registration limiter ─────────────────────────────────────────────────────

/**
 * Strict rate limiter for new alumni registration submissions.
 *
 * A 1-hour window with a low request cap prevents mass spam registrations
 * from a single IP address even if the honeypot field is bypassed.
 *
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1-hour rolling window
  max: env.REGISTRATION_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many registration requests submitted from this network. Please try again in an hour.',
  },
});

// ─── Authentication limiter ───────────────────────────────────────────────────

/**
 * Hard rate limiter for authentication endpoints (admin login & alumni login).
 *
 * Production cap is intentionally very low (5 attempts per 15 minutes) to
 * thwart credential-stuffing and brute-force attacks.
 *
 * Only failed requests (non-2xx) count toward the limit, so a successfully
 * authenticated user will not be locked out by legitimate usage.
 *
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute rolling window
  max: env.NODE_ENV === 'production' ? 5 : 50, // Relaxed in development for ease of testing
  standardHeaders: true,
  legacyHeaders: false,
  /** Only count failed login attempts toward the limit. */
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts. Account temporarily locked. Please try again in 15 minutes.',
  },
});

// ─── Authentication slow-down ─────────────────────────────────────────────────

/**
 * Progressive delay middleware applied alongside `authLimiter`.
 *
 * After 2 requests within the window, each additional request adds 500ms of
 * artificial delay (500ms, 1000ms, 1500ms…). This makes brute-force attacks
 * impractical long before the hard limit is hit.
 *
 * Apply this BEFORE `authLimiter` in route middleware stacks.
 *
 * @type {import('express-slow-down').SlowDownRequestHandler}
 */
export const authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  /** Start adding delay after this many requests. */
  delayAfter: 2,
  /**
   * Delay function: each request beyond `delayAfter` adds 500ms incrementally.
   * @param {number} hits - Total request count in the current window.
   * @returns {number} Delay in milliseconds.
   */
  delayMs: (hits) => (hits - 2) * 500,
});
