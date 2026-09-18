import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import alumniRoutes from './alumniRoutes.js';
import eventsRoutes from './eventsRoutes.js';
import storiesRoutes from './storiesRoutes.js';
import accountsRoutes from './accountsRoutes.js';
import communityRoutes from './communityRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/alumni', alumniRoutes);
router.use('/events', eventsRoutes);
router.use('/stories', storiesRoutes);
router.use('/accounts', accountsRoutes);
router.use('/community', communityRoutes);
router.use('/auth', authRoutes);

export default router;
