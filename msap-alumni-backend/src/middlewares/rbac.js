/**
 * @fileoverview Role-Based Access Control (RBAC) middleware for the MSAP Alumni API.
 *
 * The `authorize` factory creates a middleware that enforces role checks on
 * authenticated routes. It must be used AFTER the `authenticate` middleware
 * so that `req.user` is guaranteed to be populated.
 *
 * @module middlewares/rbac
 *
 * @example
 * import { authenticate } from './auth.js';
 * import { authorize } from './rbac.js';
 * import { ROLES } from '../constants/roles.js';
 *
 * router.patch(
 *   '/:id/status',
 *   authenticate,
 *   authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
 *   AlumniController.updateStatus
 * );
 */

import { ForbiddenError } from '../utils/apiError.js';

// ─── Middleware factory ───────────────────────────────────────────────────────

/**
 * Creates an Express middleware that permits access only to users whose role
 * is included in the provided `allowedRoles` list.
 *
 * Prerequisites:
 *  - The `authenticate` middleware must run first to populate `req.user`.
 *  - `req.user.role` must be a string matching one of the `ROLES` constants.
 *
 * @param {...string} allowedRoles
 *   One or more role strings (from `constants/roles.js`) that are permitted
 *   to access the protected route.
 *
 * @returns {import('express').RequestHandler} Express middleware function.
 *
 * @throws {ForbiddenError} If the user is unauthenticated or has an insufficient role.
 */
export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    // Guard: authentication middleware should always run first
    if (!req.user || !req.user.role) {
      return next(new ForbiddenError('Access denied: Unauthenticated user.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied: Required role (${allowedRoles.join(' or ')}), current role (${req.user.role})`
        )
      );
    }

    next();
  };
}
