/**
 * @fileoverview Centralised error-handling middleware for the MSAP Alumni API.
 *
 * This middleware must be registered LAST in the Express middleware chain
 * (after all routes) so that errors forwarded via `next(err)` from any route
 * handler or earlier middleware are caught and formatted consistently.
 *
 * Behaviour:
 *  - Operational errors (instances of `ApiError`) expose their messages to the client.
 *  - Unexpected / programming errors are masked in production to avoid leaking
 *    internal details; the raw message and stack are only shown in development.
 *  - Malformed JSON bodies and CORS violations are handled with specific messaging.
 *
 * @module middlewares/errorHandler
 */

import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Express 4-argument error-handling middleware.
 *
 * Formats any error thrown or forwarded within the application into a
 * consistent JSON response:
 * ```json
 * { "success": false, "message": "...", "errors": [...], "stack": "..." }
 * ```
 * `errors` is included only when the error carries field-level validation details.
 * `stack` is included only in development mode for non-operational errors.
 *
 * @param {import('../utils/apiError.js').ApiError | Error} err
 *   The error object. If it is an `ApiError`, `err.statusCode` and
 *   `err.isOperational` are used for response shaping.
 * @param {import('express').Request}  req  - Express request object.
 * @param {import('express').Response} res  - Express response object.
 * @param {import('express').NextFunction} _next - Required 4th parameter to identify this as an error handler.
 * @returns {import('express').Response} JSON error response.
 */
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isOperational = err.isOperational || false;

  // Log the error with request context; omit stack traces in production
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, {
    statusCode,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // ── Malformed JSON body ──────────────────────────────────────────────────
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Malformed JSON payload received in request body.',
    });
  }

  // ── CORS policy violation ────────────────────────────────────────────────
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Access forbidden by CORS policy.',
    });
  }

  // ── All other errors ─────────────────────────────────────────────────────
  const response = {
    success: false,
    /**
     * Operational errors (i.e. known, expected app errors like "Not Found" or
     * "Validation failed") always expose their message. Unexpected programming
     * errors are masked in production to prevent information leakage.
     */
    message: isOperational
      ? err.message
      : env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
  };

  // Include field-level validation errors when available
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace in development for easier debugging
  if (env.NODE_ENV === 'development' && !isOperational) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}
