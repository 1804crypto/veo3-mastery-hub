import '@testing-library/jest-dom';

// Setup global environment variables for tests
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.PORT = '8080';
process.env.CLIENT_ORIGIN = 'http://localhost:3000';


