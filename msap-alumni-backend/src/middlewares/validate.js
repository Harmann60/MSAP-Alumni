/**
 * @fileoverview Request validation middleware factory using Zod schemas.
 *
 * Provides a `validateRequest` factory that accepts Zod schemas for the
 * request body, query string, and path parameters. Each schema is validated
 * independently; if any fail, a `BadRequestError` is forwarded with structured
 * field-level error details.
 *
 * Validated (coerced) data is written back onto the corresponding `req`
 * property so downstream handlers always receive clean, typed input.
 *
 * @module middlewares/validate
 */

import { BadRequestError } from '../utils/apiError.js';

// ─── Middleware factory ───────────────────────────────────────────────────────

/**
 * Creates an Express middleware that validates and coerces the incoming
 * request using the provided Zod schemas.
 *
 * At least one of `body`, `query`, or `params` must be supplied, otherwise
 * the middleware is a no-op (passes through to `next()`).
 *
 * @param {object}                        schemas         - Validation targets.
 * @param {import('zod').ZodTypeAny}     [schemas.body]  - Zod schema for `req.body`.
 * @param {import('zod').ZodTypeAny}     [schemas.query] - Zod schema for `req.query`.
 * @param {import('zod').ZodTypeAny}     [schemas.params]- Zod schema for `req.params`.
 *
 * @returns {import('express').RequestHandler} Express middleware function.
 *
 * @example
 * router.post(
 *   '/register',
 *   validateRequest({ body: registerAlumniSchema }),
 *   AlumniController.register
 * );
 */
export function validateRequest({ body, query, params }) {
  return (req, _res, next) => {
    try {
      // ── Body validation ──────────────────────────────────────────────────
      if (body) {
        const parsedBody = body.safeParse(req.body);
        if (!parsedBody.success) {
          const errors = parsedBody.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          return next(new BadRequestError('Validation failed on request body', errors));
        }
        // Replace raw body with coerced/transformed values from Zod
        req.body = parsedBody.data;
      }

      // ── Query string validation ──────────────────────────────────────────
      if (query) {
        const parsedQuery = query.safeParse(req.query);
        if (!parsedQuery.success) {
          const errors = parsedQuery.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          return next(new BadRequestError('Validation failed on query parameters', errors));
        }
        req.query = parsedQuery.data;
      }

      // ── Path parameter validation ────────────────────────────────────────
      if (params) {
        const parsedParams = params.safeParse(req.params);
        if (!parsedParams.success) {
          const errors = parsedParams.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          return next(new BadRequestError('Validation failed on path parameters', errors));
        }
        req.params = parsedParams.data;
      }

      next();
    } catch (err) {
      // Catch synchronous Zod throws or other unexpected errors
      next(err);
    }
  };
}
