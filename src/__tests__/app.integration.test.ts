// @vitest-environment node
/**
 * App Configuration Integration Tests
 * 
 * Tests that the application is properly configured and ready to run.
 * Converted from standalone test-app.js script to proper vitest integration test.
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('App Configuration', () => {
    describe('Environment Files', () => {
        it('should have frontend environment file', () => {
            const exists = fs.existsSync('.env.local') || fs.existsSync('.env');
            expect(exists).toBe(true);
        });

        it('should have backend environment file', () => {
            expect(fs.existsSync('server/.env')).toBe(true);
        });

        it('should have VITE_API_BASE_URL configured', () => {
            let envContent = '';
            if (fs.existsSync('.env.local')) {
                envContent = fs.readFileSync('.env.local', 'utf8');
            } else if (fs.existsSync('.env')) {
                envContent = fs.readFileSync('.env', 'utf8');
            }
            expect(envContent).toContain('VITE_API_BASE_URL');
        });
    });

    describe('Database Configuration', () => {
        it('should have Prisma schema file', () => {
            expect(fs.existsSync('server/prisma/schema.prisma')).toBe(true);
        });

        it('should have User model in Prisma schema', () => {
            const schema = fs.readFileSync('server/prisma/schema.prisma', 'utf8');
            expect(schema).toContain('model User');
        });
    });

    describe('Key Application Files', () => {
        const keyFiles = [
            'src/App.tsx',
            'src/index.tsx',
            'server/src/index.ts',
            'server/src/routes/api.ts',
            'server/src/routes/auth.ts',
            'server/src/routes/payments.ts',
        ];

        keyFiles.forEach(file => {
            it(`should have ${file}`, () => {
                expect(fs.existsSync(file)).toBe(true);
            });
        });
    });

    describe('Dependencies', () => {
        it('should have frontend dependencies installed', () => {
            expect(fs.existsSync('node_modules')).toBe(true);
        });

        it('should have backend dependencies installed', () => {
            expect(fs.existsSync('server/node_modules')).toBe(true);
        });

        it('should have Prisma client generated', () => {
            expect(fs.existsSync('server/node_modules/@prisma/client')).toBe(true);
        });
    });

    describe('Source Structure', () => {
        it('should have src directory with proper structure', () => {
            expect(fs.existsSync('src/components')).toBe(true);
            expect(fs.existsSync('src/contexts')).toBe(true);
            expect(fs.existsSync('src/hooks')).toBe(true);
            expect(fs.existsSync('src/lib')).toBe(true);
            expect(fs.existsSync('src/services')).toBe(true);
        });

        it('should have docs directory for documentation', () => {
            expect(fs.existsSync('docs')).toBe(true);
        });
    });
});
