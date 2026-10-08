import { Router } from 'express';
import { EventsController } from '../controllers/eventsController.js';
import { validateRequest } from '../middlewares/validate.js';
import { createEventSchema, updateEventSchema } from '../validators/eventValidator.js';
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

// Protected: Update event
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest({ body: updateEventSchema }),
  EventsController.update
);

// Protected: Delete event
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  EventsController.delete
);

export default router;
