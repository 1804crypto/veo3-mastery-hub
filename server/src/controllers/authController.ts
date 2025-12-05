import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in your .env file');
}

// Initialize Google OAuth client
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Helper function to set auth cookie
const setAuthCookie = (res: Response, userId: string, email: string) => {
  const token = jwt.sign({ id: userId, email }, JWT_SECRET!, { expiresIn: '1d' });
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ ok: false, message: 'Valid email is required' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ ok: false, message: 'Password is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters long' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ ok: false, message: 'Please provide a valid email address' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ ok: false, message: 'An account with this email already exists. Please log in instead.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const normalizedEmail = email.trim().toLowerCase();
    const isTestAccount = ['freeemallfilms@gmail.com', 'testuser1764850225@example.com'].includes(normalizedEmail);

    if (isTestAccount) {
      console.log(`[Register] Creating test account with Pro access: ${normalizedEmail}`);
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password_hash,
        subscription_status: isTestAccount ? 'pro' : 'free'
      },
    });

    // Auto-login after registration
    setAuthCookie(res, user.id, user.email);

    res.status(201).json({ ok: true, message: 'Account created successfully! Welcome!', userId: user.id });
  } catch (error: unknown) {
    console.error('Registration error:', error);

    // Check for database connection errors
    if (isPrismaError(error)) {
      if (error.code === 'P1001' || error.message.includes('connect') || error.message.includes('database')) {
        return res.status(500).json({ ok: false, message: 'Database connection error. Please try again later.' });
      }
      // Check for Prisma errors
      if (error.code === 'P2002') {
        return res.status(409).json({ ok: false, message: 'An account with this email already exists.' });
      }
    }

    res.status(500).json({ ok: false, message: getErrorMessage(error) || 'Internal server error. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ ok: false, message: 'Email is required' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ ok: false, message: 'Password is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' });
    }

    // Check if user has a password (not a Google-only account)
    if (!user.password_hash) {
      return res.status(401).json({ ok: false, message: 'This account uses Google Sign-In. Please sign in with Google instead.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' });
    }

    // Grant Pro access to test account if not already pro
    const testEmails = ['freeemallfilms@gmail.com', 'testuser1764850225@example.com'];
    const normalizedUserEmail = user.email.toLowerCase();

    if (testEmails.includes(normalizedUserEmail)) {
      console.log(`[Login] Checking Pro status for test account: ${normalizedUserEmail}. Current status: ${user.subscription_status}`);

      if (user.subscription_status !== 'pro') {
        console.log(`[Login] Upgrading test account to Pro: ${normalizedUserEmail}`);
        await prisma.user.update({
          where: { id: user.id },
          data: { subscription_status: 'pro' }
        });
        user.subscription_status = 'pro'; // Update local object for response
      }
    }

    setAuthCookie(res, user.id, user.email);

    res.status(200).json({ ok: true, message: 'Login successful' });
  } catch (error: unknown) {
    console.error('Login error:', error);

    // Check for database connection errors
    if (isPrismaError(error)) {
      if (error.code === 'P1001' || error.message.includes('connect') || error.message.includes('database')) {
        return res.status(500).json({ ok: false, message: 'Database connection error. Please try again later.' });
      }
    }

    res.status(500).json({ ok: false, message: getErrorMessage(error) || 'Internal server error. Please try again.' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  const { token: googleToken } = req.body;

  if (!googleToken) {
    return res.status(400).json({ ok: false, message: 'Google token is required' });
  }

  if (!googleClient) {
    return res.status(500).json({ ok: false, message: 'Google OAuth is not configured' });
  }

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ ok: false, message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ ok: false, message: 'Google account email is required' });
    }

    // Check if user exists by email or google_id
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(googleId ? [{ google_id: googleId }] : []),
        ],
      },
    });

    if (user) {
      // Update user if they're linking Google account or updating Google ID
      if (!user.google_id && googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { google_id: googleId || undefined },
        });
      }
    } else {
      // Create new user with Google OAuth
      user = await prisma.user.create({
        data: {
          email,
          ...(googleId ? { google_id: googleId } : {}),
          // password_hash is optional in schema, so we don't need to set it
          subscription_status: ['freeemallfilms@gmail.com', 'testuser1764850225@example.com'].includes(email.toLowerCase()) ? 'pro' : 'free',
        },
      });
    }

    // Grant Pro access to test account if not already pro (for existing users logging in via Google)
    const testEmails = ['freeemallfilms@gmail.com', 'testuser1764850225@example.com'];
    const normalizedUserEmail = user.email.toLowerCase();

    if (testEmails.includes(normalizedUserEmail)) {
      console.log(`[GoogleAuth] Checking Pro status for test account: ${normalizedUserEmail}. Current status: ${user.subscription_status}`);

      if (user.subscription_status !== 'pro') {
        console.log(`[GoogleAuth] Upgrading test account to Pro: ${normalizedUserEmail}`);
        user = await prisma.user.update({
          where: { id: user.id },
          data: { subscription_status: 'pro' }
        });
      }
    }

    setAuthCookie(res, user.id, user.email);

    res.status(200).json({
      ok: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: name || null,
        picture: picture || null,
      },
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ ok: false, message: 'Google authentication failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
  res.status(200).json({ ok: true, message: 'Logout successful' });
};


// Forgot Password Controller
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ ok: false, message: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({ ok: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      },
    });

    // Create reset link
    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    const resetLink = `${clientOrigin}/reset-password?token=${resetToken}`;

    // Send email (simulated)
    await sendEmail(email, 'Password Reset Request', `Click here to reset your password: ${resetLink}`);

    res.status(200).json({ ok: true, message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ ok: false, message: 'Failed to process request' });
  }
};

// Reset Password Controller
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ ok: false, message: 'Token and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ ok: false, message: 'Invalid or expired reset token' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    res.status(200).json({ ok: true, message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ ok: false, message: 'Failed to reset password' });
  }
};

// Helper to safely access error properties
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isPrismaError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}
