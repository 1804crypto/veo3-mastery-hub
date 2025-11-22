import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
// Create an agent to persist cookies across requests (i.e., for login)
const agent = request.agent(app);

describe('Prompt Generation Route: /api/generate-prompt', () => {

    beforeAll(() => {
        // Reset the test database to a clean state before tests run
        execSync('npx prisma migrate reset --force', { stdio: 'ignore' });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return 401 Unauthorized when not authenticated', async () => {
        const res = await request(app)
            .post('/api/generate-prompt')
            .send({ idea: 'A test idea from an unauthenticated user.' });
        
        expect(res.status).toBe(401);
    });

    it('should return 200 and a mock prompt when authenticated', async () => {
        const testUser = {
            email: `prompt-test-${Date.now()}@example.com`,
            password: 'Password123!',
        };

        // First, register and log in the user to get the session cookie on the agent
        await agent.post('/api/auth/register').send(testUser);
        const loginRes = await agent.post('/api/auth/login').send(testUser);
        expect(loginRes.status).toBe(200);

        // Now, make the authenticated request using the agent
        const res = await agent
            .post('/api/generate-prompt')
            .send({ idea: 'A test idea from an authenticated user.' });
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
        expect(res.body).toHaveProperty('prompt');
        
        // Since the GEMINI_API_KEY environment variable is not set in the test environment,
        // the server should return a mocked response. We verify its contents.
        const prompt = JSON.parse(res.body.prompt);
        expect(prompt.narrative_summary).toContain('mocked narrative summary');
        expect(prompt.veo3_prompt).toContain('mocked action');
        expect(prompt.veo3_prompt).toContain('A mock subject for the idea:');
    });

    it('should return 400 Bad Request if the "idea" field is missing', async () => {
        // Log in first
        const testUser = {
            email: `prompt-test-validation-${Date.now()}@example.com`,
            password: 'Password123!',
        };
        await agent.post('/api/auth/register').send(testUser);
        await agent.post('/api/auth/login').send(testUser);

        // Make request without the 'idea' body parameter
        const res = await agent
            .post('/api/generate-prompt')
            .send({ not_an_idea: 'some other data' });
        
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            ok: false,
            message: 'The "idea" field is required.',
        });
    });
});
