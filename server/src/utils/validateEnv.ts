/**
 * Environment Variable Validation
 * Validates that all required environment variables are set on server startup
 */

interface RequiredEnvVars {
    DATABASE_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
    PORT: string;
}

interface OptionalEnvVars {
    GOOGLE_CLIENT_ID?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    GEMINI_API_KEY?: string;
    ZAI_API_KEY?: string;
    CLIENT_ORIGIN?: string;
    CLIENT_SUCCESS_URL?: string;
    CLIENT_CANCEL_URL?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
}

export function validateEnv(): void {
    const requiredVars: (keyof RequiredEnvVars)[] = [
        'NODE_ENV',
        'PORT',
    ];

    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    if (missing.length > 0) {
        console.error('❌ FATAL: Missing required environment variables:');
        missing.forEach(varName => console.error(`   - ${varName}`));
        console.error('\nServer cannot start without these variables.');
        process.exit(1);
    }

    // Check optional but recommended variables
    const optionalVars: (keyof OptionalEnvVars)[] = [
        'GOOGLE_CLIENT_ID',
        'STRIPE_SECRET_KEY',
        'ZAI_API_KEY',
        'GEMINI_API_KEY',
        'DATABASE_URL',
        'JWT_SECRET',
    ];

    for (const varName of optionalVars) {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    }

    if (warnings.length > 0) {
        console.warn('⚠️  WARNING: Optional environment variables not set:');
        warnings.forEach(varName => console.warn(`   - ${varName}`));
        console.warn('Some features may not work correctly.\n');
    }

    console.log('✅ Environment variables validated successfully\n');
}
