import { Router } from 'express';
import { GalleryController } from '../controllers/galleryController.js';
import { validateRequest } from '../middlewares/validate.js';
import { createGalleryItemSchema, updateGalleryItemSchema } from '../validators/galleryValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public: Retrieve gallery items
router.get('/', GalleryController.list);

// Protected: Add gallery item (Admin & Media Moderators) — validated by Zod schema
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  validateRequest({ body: createGalleryItemSchema }),
  GalleryController.create
);

// Protected: Update gallery item (Admin & Media Moderators) — validated by Zod schema
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  validateRequest({ body: updateGalleryItemSchema }),
  GalleryController.update
);

// Protected: Delete gallery item (Admin & Media Moderators)
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  GalleryController.delete
);

export default router;
