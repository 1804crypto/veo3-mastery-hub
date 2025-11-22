import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('verifyAuth Middleware', () => {
    it('should return 401 Unauthorized when no token is provided to a protected route', async () => {
        // We test this against the /api/me endpoint, which is protected by verifyAuth
        const res = await request(app).get('/api/me');

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            ok: false,
            message: 'Access denied. No token provided.',
        });
    });

    it('should return 401 Unauthorized for an invalid token', async () => {
        const res = await request(app)
            .get('/api/me')
            .set('Cookie', 'token=thisis-an-invalid-token');

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            ok: false,
            message: 'Invalid token.',
        });
    });
});
