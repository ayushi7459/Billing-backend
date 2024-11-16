
import express from 'express';
import { getUserById,getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import {isAdmin} from '../middlewares/Admin.js';
import { authenticateUser } from '../middlewares/Authenticate.js';

const router = express.Router();

// // Route to get all users
router.get('/', authenticateUser, isAdmin,  getAllUsers);//only admin can do this

// Route to get a specific user by ID
router.get('/:id', getUserById);

// Route to update a specific user by ID
router.put('/:id', updateUser);

// Route to delete a specific user by ID
router.delete('/:id', isAdmin, deleteUser);

export default router;
