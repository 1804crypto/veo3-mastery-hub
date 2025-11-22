import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

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
    sameSite: isProduction ? 'strict' : 'lax',
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

    const user = await prisma.user.create({
      data: { email: email.trim().toLowerCase(), password_hash },
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
        },
      });
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
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  });
  res.status(200).json({ ok: true, message: 'Logout successful' });
};

// Helper to safely access error properties
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isPrismaError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}
