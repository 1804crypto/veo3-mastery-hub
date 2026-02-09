import type { CorsOptions } from 'cors';

export const getCorsOptions = (): CorsOptions => {
    const clientOrigin = process.env.CLIENT_ORIGIN;
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Parse allowed origins (handle comma-separated list)
    const clientOrigins = clientOrigin ? clientOrigin.split(',').map(o => o.trim()) : [];

    // For development, allow localhost origins (any port)
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://veo3-mastery-hub.netlify.app',
        ...clientOrigins
    ].filter(Boolean);

    return {
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
    };
};
