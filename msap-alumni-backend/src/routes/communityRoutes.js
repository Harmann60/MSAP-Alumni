import { Router } from 'express';
import { CommunityController } from '../controllers/communityController.js';

const router = Router();

// Public: Community groups list
router.get('/groups', CommunityController.list);

export default router;
