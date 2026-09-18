import { Router } from 'express';
import { StoriesController } from '../controllers/storiesController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public: Retrieve stories
router.get('/', StoriesController.list);

// Protected: Publish story
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  StoriesController.create
);

export default router;
