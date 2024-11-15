
import express from 'express';
import { getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// // Route to get all users
// router.get('/', getAllUsers);//only admin can do this

// Route to get a specific user by ID
router.get('/:id', getUserById);

// Route to update a specific user by ID
router.put('/:id', updateUser);

// Route to delete a specific user by ID
router.delete('/:id', deleteUser);

export default router;
