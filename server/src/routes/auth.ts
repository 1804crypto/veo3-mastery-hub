import { Router } from 'express';
import { register, login, logout, googleAuth, forgotPassword, resetPassword, refreshToken } from '../controllers/authController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for Google OAuth authentication
router.post('/google', googleAuth);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for reset password
router.post('/reset-password', resetPassword);

// Route for refresh token (updates session with latest subscription status)
router.post('/refresh', verifyAuth, refreshToken);

// Route for user logout
router.post('/logout', logout);

export default router;