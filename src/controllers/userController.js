import { userModel } from '../models/users.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponce } from '../utils/ApiResponce.js';
import { ApiError } from '../utils/ApiErrors.js';

// Get a single user by ID
export const getUserById = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponce(200, user, "User fetched successfully"));
});



// Update user by ID
export const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true } // Return the updated user
    );
    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponce(200, updatedUser, "User updated successfully"));
});

// Mark user as deleted (soft delete)
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { isDeleted: 1 },
        { new: true }
    );
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponce(200, null, "User marked as deleted"));
});
