import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();

app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// User CRUD routes
app.use('/api/users', userRoutes);

export {app}