import { Router } from 'express';
import { StoriesController } from '../controllers/storiesController.js';
import { validateRequest } from '../middlewares/validate.js';
import { createStorySchema, updateStorySchema } from '../validators/storiesValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public: Retrieve stories
router.get('/', StoriesController.list);
router.get('/:id', StoriesController.getById);

// Protected: Publish story (Admin & Moderator/Content Writer) — validated by Zod schema
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  validateRequest({ body: createStorySchema }),
  StoriesController.create
);

// Protected: Update story (Admin & Moderator/Content Writer) — validated by Zod schema
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  validateRequest({ body: updateStorySchema }),
  StoriesController.update
);

// Protected: Delete story (Admin & Content Managers/Moderators)
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR),
  StoriesController.delete
);

export default router;
