import { userModel } from '../models/users.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponce } from '../utils/ApiResponce.js';
import { ApiError } from '../utils/ApiErrors.js';

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, mobile_number } = req.body;

    // Check if user already exists by email or username
    const existingUser = await userModel.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // Create a new user
    const newUser = new userModel({
        username,
        email,
        password,
        mobile_number
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json(new ApiResponce(201, { user: newUser }, "User registered successfully"));
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid email or password");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json(new ApiResponce(200, { accessToken, refreshToken }, "Login successful"));
});

// Refresh Token
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(401, "Token is required");
    }

    const user = await userModel.findOne({ refreshToken });
    if (!user) {
        throw new ApiError(403, "Invalid refresh token");
    }

    jwt.verify(refreshToken, process.env.REFERESH_TOKEN_SECRET, async (err) => {
        if (err) {
            throw new ApiError(403, "Invalid refresh token");
        }

        const accessToken = await user.generateAccessToken();
        res.status(200).json(new ApiResponce(200, { accessToken }, "Access token refreshed successfully"));
    });
});
