import { Router } from 'express';
import { generatePrompt } from '../controllers/promptController';
import { getCurrentUser } from '../controllers/userController';
import { generateSpeech } from '../controllers/speechController';
import { verifyAuth } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// This endpoint is protected. It returns the currently authenticated user's data.
router.get('/me', verifyAuth, getCurrentUser);

// This endpoint is protected and rate-limited.
// Note: Authentication is required - users must sign up/login first
router.post('/generate-prompt', verifyAuth, rateLimiter, generatePrompt);

// This endpoint is public for the learning journey.
router.post('/generate-speech', generateSpeech);


export default router;