import express from 'express';
import { isAdmin } from '../middlewares/Admin.js';  // Import admin middleware
import { getAllUsers, deleteUser } from '../controllers/AdminController.js';

const router = express.Router();

// Route accessible only by admins
router.get('/admin/users', isAdmin, getAllUsers);  // Get all users (admin-only)
router.delete('/admin/users/:id', isAdmin, deleteUser);  // Delete a user (admin-only)

export default router;
