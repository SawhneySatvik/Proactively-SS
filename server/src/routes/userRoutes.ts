import express from 'express';
import { createUserController, getUserController, updateUserController, deleteUserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create User
router.post('/', createUserController);

// Get User by ID (Protected)
router.get('/:id', authenticate, getUserController);

// Update User (Protected)
router.put('/:id', authenticate, updateUserController);

// Delete User (Protected)
router.delete('/:id', authenticate, deleteUserController);

export default router;
