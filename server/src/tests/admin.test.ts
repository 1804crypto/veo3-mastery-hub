import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import adminRoutes from '../routes/adminRoutes';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

// Mock auth middleware to simulate logged-in user
import * as authMiddleware from '../middleware/auth';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/admin', adminRoutes);

const prisma = new PrismaClient();

// Skipping integration tests because they require a running database
describe.skip('Admin Routes', () => {
    let adminToken: string;
    let userToken: string;
    let adminUserId: string;
    let regularUserId: string;

    beforeAll(async () => {
        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: `admin-${Date.now()}@test.com`,
                password_hash: 'hash',
                subscription_status: 'pro',
                // @ts-ignore
                is_admin: true,
            },
        });
        adminUserId = admin.id;
        adminToken = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'test-secret');

        // Create regular user
        const user = await prisma.user.create({
            data: {
                email: `user-${Date.now()}@test.com`,
                password_hash: 'hash',
                subscription_status: 'free',
                // @ts-ignore
                is_admin: false,
            },
        });
        regularUserId = user.id;
        userToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'test-secret');
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [adminUserId, regularUserId] } } });
        await prisma.$disconnect();
    });

    it('should allow admin to fetch users', async () => {
        // Mock the verifyAuth middleware to populate req.user
        // Note: In integration tests with supertest, we usually rely on the actual middleware.
        // Since we are using the actual router which uses verifyAuth, we need to ensure verifyAuth works with our token.
        // Our verifyAuth checks cookies or Authorization header.

        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('should deny non-admin from fetching users', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body.message).toContain('Admin privileges required');
    });

    it('should allow admin to update user status', async () => {
        const res = await request(app)
            .patch(`/api/admin/users/${regularUserId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ subscription_status: 'pro' });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.user.subscription_status).toBe('pro');
    });
});
