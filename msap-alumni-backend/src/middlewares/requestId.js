/**
 * @fileoverview Request ID middleware for the MSAP Alumni API.
 *
 * Attaches a unique, cryptographically random UUID (v4) to every incoming
 * request as `req.id` and sets the `X-Request-ID` response header.
 *
 * This enables log correlation: every Winston log entry that includes
 * `req.id` can be traced across the full request lifecycle.
 *
 * @module middlewares/requestId
 */

import crypto from 'crypto';

/**
 * Express middleware that generates and attaches a unique request ID.
 *
 * Priority:
 *  1. Reuse the incoming `X-Request-ID` header (forwarded from load balancer / CDN).
 *  2. Generate a fresh UUID v4 if no header is present.
 *
 * The final ID is:
 *  - Written to `req.id` for use in route handlers and logging.
 *  - Set on the response as `X-Request-ID` for client-side tracing.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestId(req, res, next) {
  // Validate and sanitize any incoming header to prevent header injection
  const incoming = req.headers['x-request-id'];
  const id =
    incoming && /^[a-zA-Z0-9\-_]{1,64}$/.test(incoming)
      ? incoming
      : crypto.randomUUID();

  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
}
