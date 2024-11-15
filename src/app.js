import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';





const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))

// Authentication routes
app.use('/api/auth', authRoutes);

// User CRUD routes
app.use('/api/users', userRoutes);

// Item CRUD routes
app.use('/api/items', itemRoutes);

//Category CRUD route
app.use('/api/categories', categoryRoutes);

export {app}