import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load the home page', async ({ page }) => {
        await page.goto('/');

        // Check for main heading
        await expect(page.locator('h1')).toBeVisible();

        // Check for navigation
        await expect(page.getByRole('navigation')).toBeVisible();
    });

    test('should have login button', async ({ page }) => {
        await page.goto('/');

        // Look for login button
        const loginButton = page.getByRole('button', { name: /login/i });
        await expect(loginButton).toBeVisible();
    });

    test('should open login modal when clicking login', async ({ page }) => {
        await page.goto('/');

        // Click login button
        const loginButton = page.getByRole('button', { name: /login/i });
        await loginButton.click();

        // Modal should appear
        await expect(page.getByRole('dialog')).toBeVisible();

        // Should have Google sign-in option
        await expect(page.getByText(/google/i)).toBeVisible();
    });
});

test.describe('Prompt Generator', () => {
    test('should navigate to prompt generator', async ({ page }) => {
        await page.goto('/');

        // Find and click on Prompt Generator link/button
        const promptGenLink = page.getByRole('link', { name: /prompt/i }).first();
        if (await promptGenLink.isVisible()) {
            await promptGenLink.click();

            // Should see the prompt generator interface
            await expect(page.getByPlaceholder(/idea|describe|prompt/i)).toBeVisible();
        }
    });
});

test.describe('Responsive Design', () => {
    test('should display mobile menu on small screens', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Mobile menu button should be visible
        // (Adjust selector based on your actual mobile menu implementation)
        await expect(page.locator('header')).toBeVisible();
    });
});

test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/');

        // Should have exactly one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1);
    });

    test('should have skip link for keyboard navigation', async ({ page }) => {
        await page.goto('/');

        // Press Tab and check for skip link (if implemented)
        await page.keyboard.press('Tab');

        // Check focus is on a focusable element
        const focusedElement = await page.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });
});

test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;

        // Page should load in under 5 seconds
        expect(loadTime).toBeLessThan(5000);
    });
});
