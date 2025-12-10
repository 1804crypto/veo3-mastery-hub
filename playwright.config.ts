import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',

    // Run tests in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Limit workers on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
    ],

    // Shared settings for all tests
    use: {
        // Base URL to use in tests
        baseURL: 'http://localhost:3000',

        // Collect trace when retrying a failed test
        trace: 'on-first-retry',

        // Screenshot on failure
        screenshot: 'only-on-failure',

        // Video on failure
        video: 'on-first-retry',
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        // Mobile viewports
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],

    // Run local dev server before tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
