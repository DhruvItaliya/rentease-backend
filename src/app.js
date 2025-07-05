// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fixedWindowRateLimit } from './middlewares/rateLimit.middelware.js';
import { globalErrorHandler } from './services/common.service.js';
import indexRoutes from './routes/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.React_API, 'http://192.168.29.228:5173'],
    credentials: true
}));

app.use(fixedWindowRateLimit);
app.use('/api', indexRoutes);
app.use(globalErrorHandler);

export default app;
