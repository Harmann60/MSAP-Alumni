import { Router } from 'express';
import { AccountsController } from '../controllers/accountsController.js';

const router = Router();

// Public: Financial transparency summary and registry
router.get('/', AccountsController.getSummary);

export default router;
