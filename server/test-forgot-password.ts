
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function testForgotPassword() {
    const email = 'test-forgot-pw@example.com';
    const password = 'password123';
    const newPassword = 'newpassword456';

    try {
        // 1. Setup: Create user
        console.log('1. Creating test user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Clean up existing user if any
        await prisma.user.deleteMany({ where: { email } });

        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                subscription_status: 'free'
            }
        });
        console.log('User created:', user.id);

        // 2. Simulate Forgot Password Request (Backend Logic)
        console.log('\n2. Simulating Forgot Password Request...');
        // We can't call the API directly easily without running server, so we'll simulate the controller logic
        // or just use fetch if the server is running. Let's use fetch since the server IS running.

        const apiUrl = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
        console.log(`Calling API: ${apiUrl}/api/auth/forgot-password`);

        const forgotRes = await fetch(`${apiUrl}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const forgotData = await forgotRes.json();
        console.log('Forgot Password Response:', forgotData);

        if (!forgotRes.ok) throw new Error('Forgot password request failed');

        // 3. Verify Token in DB
        console.log('\n3. Verifying Token in DB...');
        const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

        if (!updatedUser?.reset_token) {
            throw new Error('Reset token not found in database');
        }
        console.log('Reset Token found:', updatedUser.reset_token);

        // 4. Reset Password
        console.log('\n4. Resetting Password...');
        const resetRes = await fetch(`${apiUrl}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: updatedUser.reset_token,
                password: newPassword
            }),
        });

        const resetData = await resetRes.json();
        console.log('Reset Password Response:', resetData);

        if (!resetRes.ok) throw new Error('Reset password request failed');

        // 5. Verify Login with New Password
        console.log('\n5. Verifying Login with New Password...');
        const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: newPassword }),
        });

        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);

        if (loginRes.ok) {
            console.log('\nSUCCESS: Password reset flow verified!');
        } else {
            console.error('\nFAILURE: Login with new password failed');
        }

    } catch (error) {
        console.error('\nERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testForgotPassword();
