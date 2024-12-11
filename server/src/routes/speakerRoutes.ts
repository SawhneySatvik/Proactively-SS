import express from 'express';
import { assignSpeakerController, getSpeakerController, getAllSpeakersController } from '../controllers/speakerController';
import { authenticate } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

// Assign User to Speaker Table (Only speakers)
router.post('/', authenticate, checkRole(['speaker']), assignSpeakerController);

// Get Speaker by User ID (Authenticated users)
router.get('/:user_id', authenticate, getSpeakerController);

// Get All Speakers (Public route)
router.get('/', getAllSpeakersController);

export default router;
