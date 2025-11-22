import { Router } from 'express';
import { register, login, logout, googleAuth } from '../controllers/authController';

const router = Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for Google OAuth authentication
router.post('/google', googleAuth);

// Route for user logout
router.post('/logout', logout);

export default router;