import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import plans from '../../config/plans.json';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Validate environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const CLIENT_SUCCESS_URL = process.env.CLIENT_SUCCESS_URL || 'http://localhost:3000?payment=success';
const CLIENT_CANCEL_URL = process.env.CLIENT_CANCEL_URL || 'http://localhost:3000?payment=cancelled';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing from environment variables.');
}
// Note: CLIENT_SUCCESS_URL and CLIENT_CANCEL_URL have defaults for development
// STRIPE_WEBHOOK_SECRET is only needed for webhook verification (optional for development)

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

// Type guard for planId
type PlanId = keyof typeof plans;
const isValidPlanId = (planId: unknown): planId is PlanId => {
    return typeof planId === 'string' && planId in plans;
}

/**
 * Appends a log entry to the stripe_events.log file for auditing.
 * Creates the logs directory if it doesn't exist.
 */
const logStripeEvent = (eventType: string, customerId: string | null, userId: string | null) => {
    try {
        // FIX: Replaced __dirname with process.cwd() for compatibility with ES modules and different execution contexts.
        const logDir = path.join(process.cwd(), 'server', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logFile = path.join(logDir, 'stripe_events.log');
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] Event: ${eventType}, Stripe Customer: ${customerId || 'N/A'}, UserID: ${userId || 'N/A'}\n`;
        fs.appendFileSync(logFile, logMessage);
    } catch (error) {
        console.error('Failed to write to stripe_events.log:', error);
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    const { planId } = req.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
        return res.status(401).json({ ok: false, message: 'Authentication error.' });
    }

    if (typeof planId !== 'string' || !isValidPlanId(planId)) {
        return res.status(400).json({ ok: false, message: 'Invalid or missing planId.' });
    }

    const { priceId } = plans[planId];

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ ok: false, message: 'User not found.' });
        }

        let stripeCustomerId = user.stripe_customer_id;

        // Create a Stripe customer if one doesn't exist
        if (!stripeCustomerId) {
            console.log(`[Stripe] Creating new customer for user: ${userId}`);
            const customer = await stripe.customers.create({ email: userEmail });
            stripeCustomerId = customer.id;

            // Save the new customer ID to the database
            await prisma.user.update({
                where: { id: userId },
                data: { stripe_customer_id: stripeCustomerId },
            });
            console.log(`[Stripe] Saved new customer ID ${stripeCustomerId} for user: ${userId}`);
        }

        // Create the Stripe Checkout session
        // Lifetime plans use 'payment' mode, monthly plans use 'subscription' mode
        const isLifetime = planId === 'lifetime';
        console.log(`[Stripe] Creating checkout session for user: ${userId}, plan: ${planId}`);
        // Build success and cancel URLs - use environment variables or default to localhost for development
        const successUrl = CLIENT_SUCCESS_URL || 'http://localhost:3000?payment=success';
        const cancelUrl = CLIENT_CANCEL_URL || 'http://localhost:3000?payment=cancelled';

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: isLifetime ? 'payment' : 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId,
                planId: planId,
            },
        });

        if (!session.id) {
            throw new Error('Stripe session ID was not created.');
        }

        console.log(`[Stripe] Successfully created session ${session.id} for user: ${userId}`);
        res.status(200).json({ ok: true, sessionId: session.id, message: 'Checkout session created successfully' });

    } catch (error: unknown) {
        console.error(`[Stripe] Error creating checkout session for user ${userId}:`, error);

        // Check for Stripe-specific errors
        if (typeof error === 'object' && error !== null && 'type' in error) {
            const stripeError = error as { type: string; message?: string };
            if (stripeError.type === 'StripeCardError') {
                return res.status(400).json({ ok: false, message: stripeError.message || 'Card error occurred' });
            }

            if (stripeError.type === 'StripeInvalidRequestError') {
                return res.status(400).json({ ok: false, message: stripeError.message || 'Invalid request to Stripe' });
            }
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('No such price')) {
            return res.status(400).json({ ok: false, message: 'Invalid subscription plan. Please contact support.' });
        }

        res.status(500).json({
            ok: false,
            message: errorMessage || 'Internal server error while creating checkout session. Please try again.'
        });
    }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
    // Webhook secret is optional for development
    if (!STRIPE_WEBHOOK_SECRET) {
        console.warn('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured. Webhook verification skipped.');
        // In development, we might skip webhook verification
        // In production, this should be required
        return res.status(200).json({ received: true, message: 'Webhook received but not verified (development mode)' });
    }

    const sig = req.headers['stripe-signature'];

    if (!sig) {
        console.error('[Stripe Webhook] Signature missing from header.');
        return res.status(400).send('Webhook Error: Missing signature');
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`[Stripe Webhook] Signature verification failed: ${errorMessage}`);
        return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    let customerId: string | null = null;
    let subscriptionStatus: 'pro' | 'free' | null = null;

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
        case 'invoice.payment_succeeded': {
            const session = event.data.object as { customer?: string | Stripe.Customer | null };
            if (session.customer) {
                customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
                subscriptionStatus = 'pro';
            }
            break;
        }
        case 'customer.subscription.deleted':
        case 'invoice.payment_failed': {
            const subscription = event.data.object as { customer?: string | Stripe.Customer | null };
            if (subscription.customer) {
                customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
                subscriptionStatus = 'free';
            }
            break;
        }
        default: {
            // Log unhandled events for auditing but take no action.
            const unhandledObject = event.data.object as { customer?: string | Stripe.Customer | null };
            const unhandledCustomerId = unhandledObject.customer ? (typeof unhandledObject.customer === 'string' ? unhandledObject.customer : unhandledObject.customer.id) : null;
            logStripeEvent(event.type, unhandledCustomerId, null);
            return res.status(200).json({ received: true, message: `Unhandled event type: ${event.type}` });
        }
    }

    if (customerId && subscriptionStatus) {
        try {
            const user = await prisma.user.findUnique({
                where: { stripe_customer_id: customerId }
            });

            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { subscription_status: subscriptionStatus }
                });
                console.log(`[Stripe Webhook] Updated user ${user.id} to status: ${subscriptionStatus}`);
                logStripeEvent(event.type, customerId, user.id);
            } else {
                console.warn(`[Stripe Webhook] User not found for customer ID: ${customerId}`);
                logStripeEvent(event.type, customerId, 'USER_NOT_FOUND');
            }
        } catch (error) {
            console.error(`[Stripe Webhook] Database update failed for customer ${customerId}:`, error);
            logStripeEvent(event.type, customerId, 'DB_UPDATE_FAILED');
            // Return 500 to signal to Stripe that the webhook failed and should be retried.
            return res.status(500).json({ error: 'Database update failed' });
        }
    } else {
        logStripeEvent(event.type, customerId, 'NO_ACTION_TAKEN');
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
};