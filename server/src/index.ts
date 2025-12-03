import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import paymentsRouter from './routes/payments';
import promptsRouter from './routes/prompts';
import communityRouter from './routes/community';
import { validateEnv } from './utils/validateEnv';

// Load environment variables
dotenv.config();

// Validate environment variables before starting
validateEnv();

const app = express();
const port = process.env.PORT || 8080;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
    crossOriginEmbedderPolicy: false,
}));

// CORS configuration - Allow localhost for development
const clientOrigin = process.env.CLIENT_ORIGIN;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Parse allowed origins (handle comma-separated list)
const clientOrigins = clientOrigin ? clientOrigin.split(',').map(o => o.trim()) : [];

// For development, allow localhost origins (any port)
const allowedOrigins = isDevelopment
    ? ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:8000', ...clientOrigins].filter(Boolean)
    : clientOrigins;

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        console.log('CORS Check - Origin:', origin, 'Environment:', isDevelopment ? 'development' : 'production');

        if (isDevelopment) {
            // In development, allow any localhost origin (any port) for easier testing
            if (origin.startsWith('http://localhost') ||
                origin.startsWith('http://127.0.0.1') ||
                origin.startsWith('http://0.0.0.0') ||
                allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
        } else {
            // In production, only allow the configured origin
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api', apiRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/community', communityRouter);


// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ ok: true, message: 'Server is healthy' });
});

// Start the server only if run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port}`);
    });
}

export default app;