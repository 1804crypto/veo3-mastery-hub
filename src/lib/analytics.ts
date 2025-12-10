/**
 * Simple analytics tracking utility
 * 
 * This is a lightweight analytics implementation that can be easily
 * swapped for Mixpanel, Amplitude, or PostHog in the future.
 * 
 * To enable external analytics, set VITE_ANALYTICS_ENDPOINT in your environment.
 */

interface AnalyticsEvent {
    event: string;
    properties?: Record<string, unknown>;
    timestamp: number;
    userId?: string;
    sessionId: string;
}

// Generate a session ID for this browser session
const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

// User ID (set after login)
let currentUserId: string | undefined;

// Event queue for batching
const eventQueue: AnalyticsEvent[] = [];
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

/**
 * Track an analytics event
 */
export function track(event: string, properties?: Record<string, unknown>) {
    const analyticsEvent: AnalyticsEvent = {
        event,
        properties,
        timestamp: Date.now(),
        userId: currentUserId,
        sessionId: getSessionId(),
    };

    eventQueue.push(analyticsEvent);

    // Log in development
    if (import.meta.env.DEV) {
        console.log('[Analytics]', event, properties);
    }

    // Flush if queue is full
    if (eventQueue.length >= BATCH_SIZE) {
        flush();
    }
}

/**
 * Common tracking events
 */
export const Analytics = {
    // Page views
    pageView: (page: string) => track('page_view', { page }),

    // Authentication
    login: (method: 'google' | 'email') => track('login', { method }),
    logout: () => track('logout'),
    signup: (method: 'google' | 'email') => track('signup', { method }),

    // Feature usage
    generatePrompt: (ideaLength: number) => track('generate_prompt', { ideaLength }),
    enhancePrompt: (component: string) => track('enhance_prompt', { component }),
    playTTS: () => track('play_tts'),

    // Subscription
    viewPricing: () => track('view_pricing'),
    startCheckout: (plan: string) => track('start_checkout', { plan }),
    completeCheckout: (plan: string) => track('complete_checkout', { plan }),

    // Errors
    error: (error: string, context?: string) => track('error', { error, context }),
};

/**
 * Set the current user ID (call after login)
 */
export function identify(userId: string) {
    currentUserId = userId;
    track('identify', { userId });
}

/**
 * Clear user ID (call after logout)
 */
export function reset() {
    currentUserId = undefined;
    track('reset');
}

/**
 * Flush events to analytics endpoint
 */
async function flush() {
    if (eventQueue.length === 0) return;

    const events = [...eventQueue];
    eventQueue.length = 0; // Clear queue

    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;

    // If no endpoint configured, just log in development
    if (!endpoint) {
        if (import.meta.env.DEV) {
            console.log('[Analytics] Would send:', events);
        }
        return;
    }

    try {
        await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events }),
            keepalive: true, // Ensure request completes even if page unloads
        });
    } catch (error) {
        // Don't break the app if analytics fails
        console.warn('[Analytics] Failed to send events:', error);
    }
}

// Flush on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flush);

    // Periodic flush
    setInterval(flush, FLUSH_INTERVAL);
}

export default Analytics;
