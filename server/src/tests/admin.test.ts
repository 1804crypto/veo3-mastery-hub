import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { Request, Response, NextFunction } from 'express';

// Mock PrismaClient
const { mockPrisma } = vi.hoisted(() => {
    return {
        mockPrisma: {
            user: {
                findMany: vi.fn(),
                update: vi.fn(),
            },
        },
    };
});

vi.mock('@prisma/client', () => ({
    PrismaClient: class {
        constructor() {
            return mockPrisma;
        }
    },
}));

// Mock auth middleware
vi.mock('../middleware/auth', () => ({
    verifyAuth: (req: Request, res: Response, next: NextFunction) => {
        (req as Request & { user?: { id: string; email: string; is_admin: boolean } }).user = { id: 'admin-id', email: 'admin@example.com', is_admin: true };
        next();
    },
    authenticateToken: (req: Request, res: Response, next: NextFunction) => {
        (req as Request & { user?: { id: string; email: string; is_admin: boolean } }).user = { id: 'admin-id', email: 'admin@example.com', is_admin: true };
        next();
    }
}));

// Mock admin middleware
vi.mock('../middleware/admin', () => ({
    verifyAdmin: (req: Request, res: Response, next: NextFunction) => {
        next();
    }
}));

import app from '../index';

describe('Admin Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GET /api/admin/users should return users list', async () => {
        mockPrisma.user.findMany.mockResolvedValue([
            { id: '1', email: 'user1@example.com', is_admin: false },
            { id: '2', email: 'admin@example.com', is_admin: true }
        ]);

        const res = await request(app).get('/api/admin/users');
        expect(res.status).toBe(200);
        expect(res.body.users).toHaveLength(2);
    });

    it('PATCH /api/admin/users/:userId/status should update user status', async () => {
        mockPrisma.user.update.mockResolvedValue({
            id: '1',
            email: 'user1@example.com',
            subscription_status: 'pro'
        });

        const res = await request(app)
            .patch('/api/admin/users/1/status')
            .send({ subscription_status: 'pro' });

        expect(res.status).toBe(200);
        expect(res.body.user.subscription_status).toBe('pro');
    });
});
