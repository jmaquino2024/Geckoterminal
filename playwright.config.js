import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests', // Directory containing your test files
    timeout: 60000, // Timeout for each test in milliseconds
    retries: 0, // Number of retries for failed tests
    use: {
        headless: false, // Run tests in headless mode
        viewport: { width: 1280, height: 720 }, // Default viewport size
        ignoreHTTPSErrors: true, // Ignore HTTPS errors
        video: 'retain-on-failure', // Record video on test failure
    },
});
