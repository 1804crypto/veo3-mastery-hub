import * as Sentry from "@sentry/react";

// Only initialize in production
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
    if (SENTRY_DSN && import.meta.env.PROD) {
        Sentry.init({
            dsn: SENTRY_DSN,
            environment: import.meta.env.MODE,

            // Performance Monitoring
            tracesSampleRate: 0.1, // 10% of transactions

            // Session Replay (optional - uses more quota)
            replaysSessionSampleRate: 0.01, // 1% of sessions
            replaysOnErrorSampleRate: 0.5,  // 50% of error sessions

            // Filter out noisy errors
            ignoreErrors: [
                "ResizeObserver loop limit exceeded",
                "Network request failed",
                "Load failed",
                /^Loading chunk .* failed/,
            ],

            // Add user context when available
            beforeSend(event) {
                // Don't send events in development
                if (import.meta.env.DEV) {
                    return null;
                }
                return event;
            },
        });

        console.log('[Sentry] Initialized for production');
    } else {
        console.log('[Sentry] Skipped initialization (dev mode or no DSN)');
    }
}

/**
 * Capture an error with additional context
 */
export function captureError(error: Error, context?: Record<string, unknown>) {
    if (import.meta.env.PROD && SENTRY_DSN) {
        Sentry.captureException(error, {
            extra: context,
        });
    }
    console.error('[Error]', error, context);
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id: string; email: string } | null) {
    if (import.meta.env.PROD && SENTRY_DSN) {
        if (user) {
            Sentry.setUser({ id: user.id, email: user.email });
        } else {
            Sentry.setUser(null);
        }
    }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
    if (import.meta.env.PROD && SENTRY_DSN) {
        Sentry.addBreadcrumb({
            message,
            category,
            data,
            level: "info",
        });
    }
}

export { Sentry };
