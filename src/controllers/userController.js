
import { userModel } from '../models/users.js';

// Get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
// Get all active users (not marked as deleted)
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ isDeleted: 0 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update user by ID
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return the updated user
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: 1 },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User marked as deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
