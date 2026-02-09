import './config/env'; // Must be first
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import adminRoutes from './routes/adminRoutes';
import paymentsRouter from './routes/payments';
import promptsRouter from './routes/prompts';
import communityRouter from './routes/community';
import { validateEnv } from './utils/validateEnv';
import { getCorsOptions } from './utils/corsConfig';

// Validate environment variables before starting
validateEnv();

const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

// CORS configuration
app.use(cors(getCorsOptions()));

import { requestLogger } from './middleware/requestLogger';

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Prevent caching of API responses
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api', apiRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/community', communityRouter);


// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ ok: true, message: 'Server is healthy' });
});

export default app;
