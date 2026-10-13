import { Router } from 'express';
import { AlumniController } from '../controllers/alumniController.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  registerAlumniSchema,
  updateAlumniStatusSchema,
  updateAlumniProfileSchema,
  assignRoleSchema,
  revokeRoleSchema,
} from '../validators/alumniValidator.js';
import { registrationLimiter } from '../middlewares/rateLimiter.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public: Register new alumni profile (Throttled by registrationLimiter & validated by Zod)
router.post(
  '/register',
  registrationLimiter,
  validateRequest({ body: registerAlumniSchema }),
  AlumniController.register
);

// Protected: Admin list of submissions (RESTRICTED to SUPER_ADMIN & ADMIN — Content managers/moderators cannot access)
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  AlumniController.list
);

// Protected: Admin export alumni roster as CSV
router.get(
  '/export',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  AlumniController.exportCSV
);

// Protected: Admin list staff & editorial team
router.get(
  '/team',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  AlumniController.listTeam
);

// Protected: Admin assign role (Content Manager) to registered alumni
router.post(
  '/assign-role',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest({ body: assignRoleSchema }),
  AlumniController.assignRole
);

// Protected: Admin revoke staff/editorial role
router.post(
  '/revoke-role',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest({ body: revokeRoleSchema }),
  AlumniController.revokeRole
);

// Protected: Admin approve/reject submission
router.patch(
  '/:id/status',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest({ body: updateAlumniStatusSchema }),
  AlumniController.updateStatus
);

// Protected: Admin update alumni profile details
router.patch(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest({ body: updateAlumniProfileSchema }),
  AlumniController.updateProfile
);

// Protected: Admin delete submission permanently
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  AlumniController.delete
);

export default router;
