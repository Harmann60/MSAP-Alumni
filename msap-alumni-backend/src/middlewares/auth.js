/**
 * @fileoverview JWT authentication middleware for the MSAP Alumni API.
 *
 * Extracts and verifies JSON Web Tokens from incoming requests.
 * Supports two token delivery mechanisms, in priority order:
 *   1. HttpOnly cookie (`access_token`) — preferred for browser clients
 *   2. Authorization header (`Bearer <token>`) — for API clients / mobile apps
 *
 * On success, the decoded JWT payload is attached to `req.user` for use
 * by downstream route handlers and RBAC middleware.
 *
 * @module middlewares/auth
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/apiError.js';

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Express middleware that authenticates requests by verifying a JWT token.
 *
 * The token is extracted from (in order of preference):
 *   1. `req.cookies.access_token` — set as an HttpOnly cookie by the login endpoint.
 *   2. `req.headers.authorization` — expected format: `Bearer <token>`.
 *
 * On successful verification the decoded payload is written to `req.user`.
 * On failure a 401 `UnauthorizedError` is forwarded to the error handler.
 *
 * @param {import('express').Request}  req  - Express request object.
 * @param {import('express').Response} _res - Express response object (unused).
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {void}
 */
export function authenticate(req, _res, next) {
  let token = null;

  // 1. Prefer the HttpOnly cookie (CSRF-safe for same-origin browser requests)
  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }
  // 2. Fall back to the Authorization header (REST clients, mobile apps)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('Authentication required. Missing token.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    /** @type {import('../services/authService.js').JwtPayload} */
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Session expired. Please log in again.'));
    }
    return next(new UnauthorizedError('Invalid authentication token.'));
  }
}
