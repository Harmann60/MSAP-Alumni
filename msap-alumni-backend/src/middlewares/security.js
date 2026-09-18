/**
 * @fileoverview Security headers and CORS configuration for the MSAP Alumni API.
 *
 * Two factory functions are exported:
 *  - `configureSecurityHeaders()` — returns a Helmet middleware instance with
 *    a strict Content Security Policy, HSTS, and other hardening headers.
 *  - `configureCors()` — returns a cors middleware instance that enforces an
 *    allowlist-based origin policy in production.
 *
 * @module middlewares/security
 */

import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env.js';

// ─── Security Headers ─────────────────────────────────────────────────────────

/**
 * Creates and returns a Helmet middleware instance configured for the MSAP
 * Alumni API.
 *
 * Headers configured:
 *  - **Content-Security-Policy** — restricts resource origins to prevent XSS
 *    and data-injection attacks.
 *  - **Strict-Transport-Security (HSTS)** — forces HTTPS for 1 year, including
 *    subdomains, with preload opt-in.
 *  - **X-Frame-Options** — set to DENY to prevent clickjacking.
 *  - **X-Content-Type-Options** — prevents MIME-type sniffing.
 *  - **Referrer-Policy** — limits referrer information to same origin.
 *  - **Cross-Origin-Resource-Policy** — allows cross-origin reads (needed for
 *    Supabase storage / image CDN).
 *
 * @returns {import('express').RequestHandler} Configured Helmet middleware.
 */
export function configureSecurityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.supabase.co', 'https://res.cloudinary.com'],
        connectSrc: ["'self'", env.CLIENT_URL],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        /** Upgrade HTTP to HTTPS only in production to avoid breaking local dev. */
        upgradeInsecureRequests: env.NODE_ENV === 'production' ? [] : null,
      },
    },
    /** Disabled to prevent breaking cross-origin resources loaded by the frontend. */
    crossOriginEmbedderPolicy: false,
    /** Allow cross-origin reads — required for Supabase Storage image URLs. */
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

/**
 * The set of origins that are always permitted to access the API.
 * The `CLIENT_URL` from the environment is included at runtime to allow
 * the production frontend without hardcoding its domain.
 *
 * @type {string[]}
 */
const ALWAYS_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

/**
 * Creates and returns a CORS middleware instance with an allowlist-based
 * origin policy.
 *
 * Policy summary:
 *  - In **production**: only requests from `env.CLIENT_URL` and the list above
 *    are allowed. Requests with no `Origin` header (server-to-server) are
 *    also blocked in production to prevent SSRF-style misuse.
 *  - In **development**: all origins are permitted for ease of local testing.
 *
 * @returns {import('express').RequestHandler} Configured CORS middleware.
 */
export function configureCors() {
  const allowedOrigins = [env.CLIENT_URL, ...ALWAYS_ALLOWED_ORIGINS].filter(Boolean);

  return cors({
    /**
     * @param {string | undefined} origin - The `Origin` header value from the request.
     * @param {Function} callback - cors callback: `callback(error, allow)`.
     */
    origin: (origin, callback) => {
      // No origin header — typical for same-server calls, curl, Postman, mobile apps
      if (!origin) {
        // In production, block originless requests to reduce SSRF surface.
        if (env.NODE_ENV === 'production') {
          return callback(new Error('CORS policy: requests without an Origin header are not permitted in production.'), false);
        }
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      const error = new Error(`CORS policy blocked access from origin: ${origin}`);
      error.statusCode = 403;
      return callback(error, false);
    },
    /** Allow cookies and Authorization headers to be sent cross-origin. */
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token'],
    exposedHeaders: ['Set-Cookie'],
    /** Cache preflight response for 24 hours to reduce OPTIONS request overhead. */
    maxAge: 86400,
  });
}
