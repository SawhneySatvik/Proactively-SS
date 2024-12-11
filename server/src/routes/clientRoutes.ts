import express from 'express';
import { assignClientController, getClientController } from '../controllers/clientController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Assign User to Client Table (Protected)
router.post('/', authenticate, assignClientController);

// Get Client by User ID (Protected)
router.get('/:user_id', authenticate, getClientController);

export default router;
