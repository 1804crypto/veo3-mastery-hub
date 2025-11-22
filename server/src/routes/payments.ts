import express, { Router } from 'express';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/paymentsController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

// This endpoint is protected. A valid JWT must be provided.
router.post('/create-checkout-session', verifyAuth, createCheckoutSession);

// Stripe webhook endpoint. Raw body parsing is required for signature verification.
// This route must use express.raw() instead of express.json().
router.post(
    '/stripe-webhook', 
    express.raw({ type: 'application/json' }), 
    handleStripeWebhook
);

export default router;
