import { Router } from 'express';
import { AlumniController } from '../controllers/alumniController.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  registerAlumniSchema,
  updateAlumniStatusSchema,
  updateAlumniProfileSchema,
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

// Protected: Admin list of submissions
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  AlumniController.list
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
