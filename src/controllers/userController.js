import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register a new user
export const registerUser = async (req, res) => {
    const { username, email, mobile_number, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Create a new user
        const newUser = new userModel({ username, email, mobile_number, password });
        await newUser.save();

        // Generate tokens
        const accessToken = await newUser.generateAccessToken();
        const refreshToken = await newUser.generateRefreshToken();

        // Save the refresh token
        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if the password is correct
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Save the refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// Refresh access token
export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFERESH_TOKEN_SECRET);
        
        // Find the user
        const user = await userModel.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate a new access token
        const accessToken = await user.generateAccessToken();
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token", error });
    }
};

// Logout a user (clear the refresh token)
export const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Find the user with the given refresh token
        const user = await userModel.findOne({ refreshToken });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Clear the refresh token
        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
};
