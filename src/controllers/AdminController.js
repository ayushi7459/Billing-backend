import { userModel } from '../models/users.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponce } from '../utils/ApiResponce.js';
import { ApiError } from '../utils/ApiErrors.js';

// Get all users (only for admins)
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userModel.find({ role: 'user' }); // Get all users with role 'user'
    res.status(200).json(new ApiResponce(200, users, "Users fetched successfully"));
});

// Delete a user (only for admins)
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponce(200, null, "User deleted successfully"));
});
