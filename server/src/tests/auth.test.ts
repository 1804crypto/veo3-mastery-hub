// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import request from 'supertest';

// Mock environment variables before importing app
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'; // Mock DB URL if needed

import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Skipping integration tests because they require a running database
describe.skip('Auth Endpoints', () => {
    let testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123'
    };

    beforeAll(async () => {
        // Clean up test user if exists
        await prisma.user.deleteMany({
            where: { email: testUser.email }
        });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: { email: testUser.email }
        });
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.ok).toBe(true);
        expect(res.body.userId).toBeDefined();
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.ok).toBe(false);
    });
});
