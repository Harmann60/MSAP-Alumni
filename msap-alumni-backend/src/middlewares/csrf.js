/**
 * @fileoverview Double-Submit Cookie CSRF protection middleware for the MSAP Alumni API.
 *
 * Implements the Double-Submit Cookie pattern for state-mutating requests
 * (POST, PUT, PATCH, DELETE) that rely on HttpOnly cookie authentication.
 *
 * How it works:
 *  1. Every incoming request is checked for a `csrf_token` cookie; if missing,
 *     a cryptographically secure 32-byte hex token is generated and set as a cookie.
 *  2. For state-mutating requests authenticated via the `access_token` cookie,
 *     the client must submit the matching token in the `X-CSRF-Token` header.
 *  3. Tokens are compared in constant time via `crypto.timingSafeEqual` to prevent
 *     timing-attack vulnerabilities.
 *  4. Pure Bearer-token requests (e.g. mobile apps, CLI) are exempt because browsers
 *     cannot inject the `Authorization: Bearer` header in cross-origin CSRF attacks.
 *
 * @module middlewares/csrf
 */

import crypto from 'crypto';
import { env } from '../config/env.js';
import { ForbiddenError } from '../utils/apiError.js';

const CSRF_COOKIE_NAME = 'csrf_token';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Returns options for setting the CSRF token cookie.
 * `httpOnly` is false so client-side JavaScript can read it to populate headers.
 *
 * @returns {import('express').CookieOptions}
 */
export function getCsrfCookieOptions() {
  return {
    httpOnly: false, // Must be accessible to client JS for double-submit
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/**
 * Generates a cryptographically random CSRF token.
 *
 * @returns {string} 64-character hex string.
 */
export function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Express middleware that:
 *  - Ensures a `csrf_token` cookie exists on every response.
 *  - Validates `X-CSRF-Token` on state-mutating requests that use cookie auth.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function csrfProtection(req, res, next) {
  // 1. Ensure the client has a CSRF cookie
  let cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  if (!cookieToken) {
    cookieToken = generateCsrfToken();
    res.cookie(CSRF_COOKIE_NAME, cookieToken, getCsrfCookieOptions());
  }

  // 2. Safe HTTP methods (GET, HEAD, OPTIONS) do not mutate state
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  // 3. If request uses an explicit Bearer token header, it is immune to CSRF
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // 4. If request is not authenticated via cookie (e.g. initial public login/register before any auth cookie exists),
  // check if an access_token cookie is present.
  const hasAuthCookie = Boolean(req.cookies?.access_token);

  // If the request relies on cookie-based authentication, CSRF validation is MANDATORY.
  if (hasAuthCookie) {
    const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];

    if (!headerToken) {
      return next(new ForbiddenError('CSRF token missing in request headers'));
    }

    if (typeof headerToken !== 'string' || typeof cookieToken !== 'string') {
      return next(new ForbiddenError('Invalid CSRF token format'));
    }

    const headerBuffer = Buffer.from(headerToken);
    const cookieBuffer = Buffer.from(cookieToken);

    if (headerBuffer.length !== cookieBuffer.length || !crypto.timingSafeEqual(headerBuffer, cookieBuffer)) {
      return next(new ForbiddenError('Invalid CSRF token'));
    }
  }

  next();
}
