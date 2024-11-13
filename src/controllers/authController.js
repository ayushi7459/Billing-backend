
import { userModel } from '../models/users.js';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, mobile_number } = req.body;

        // Check if user already exists by email or username
        const existingUser = await userModel.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
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

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {  // Duplicate key error
            return res.status(400).json({ message: "Username or email already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid email or password' });

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ accessToken, refreshToken, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh Token
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Token is required' });

    try {
        const user = await userModel.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.REFERESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });

            const accessToken = await user.generateAccessToken();
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
