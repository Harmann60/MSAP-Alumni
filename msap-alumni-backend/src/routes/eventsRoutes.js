import { Router } from 'express';
import { EventsController } from '../controllers/eventsController.js';
import { validateRequest } from '../middlewares/validate.js';
import { createEventSchema } from '../validators/eventValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public: Retrieve events
router.get('/', EventsController.list);

// Protected: Create event
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest({ body: createEventSchema }),
  EventsController.create
);

export default router;
