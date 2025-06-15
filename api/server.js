import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from '../config/dbConnect.js';
import authRouter from '../routes/auth.routes.js';
import productRouter from '../routes/product.routes.js';
import categoryRouter from '../routes/category.routes.js';
import subCategoryRouter from '../routes/subCategory.routes.js';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Ensure DB connects once per cold start
let isConnected = false;
app.use(async (req, res, next) => {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
            console.log("✅ MongoDB connected");
        } catch (err) {
            console.error("❌ MongoDB connection failed", err);
            return res.status(500).json({ error: "Database connection failed" });
        }
    }
    next();
});

app.get('/', (req, res) => {
    res.send("hello shubham");
});

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subCategory', subCategoryRouter);

export default serverless(app); // ✅ This is what Vercel needs
