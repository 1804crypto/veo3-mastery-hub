import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

describe('Auth Routes: /api/auth', () => {
    beforeAll(() => {
        // Ensure the test database is reset for a clean state before tests run
        execSync('npx prisma migrate reset --force', { stdio: 'ignore' });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
    };

    it('should register a new user successfully (POST /register)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('ok', true);
        expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    it('should fail to register a user with an existing email (POST /register)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser); // Use the same user details
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('ok', false);
        expect(res.body).toHaveProperty('message', 'User with this email already exists');
    });

    it('should log in an existing user and set a secure cookie (POST /login)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
        
        // Verify that a secure, HttpOnly cookie is set
        const cookie = res.headers['set-cookie'][0];
        expect(cookie).toMatch(/token=.+/);
        expect(cookie).toMatch(/HttpOnly/);
        expect(cookie).toMatch(/SameSite=Strict/);
    });

    it('should fail to log in with an incorrect password (POST /login)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: 'this-is-wrong' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('ok', false);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail to log in with a non-existent email (POST /login)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nosuchuser@example.com', password: 'Password123!' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('ok', false);
    });
});
