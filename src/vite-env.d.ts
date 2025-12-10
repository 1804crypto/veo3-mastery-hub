/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
    readonly VITE_GOOGLE_CLIENT_ID?: string;
    readonly VITE_GEMINI_API_KEY?: string;
    readonly VITE_SENTRY_DSN?: string;
    readonly VITE_ANALYTICS_ENDPOINT?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
