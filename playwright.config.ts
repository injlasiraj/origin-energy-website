import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Origin Energy UI Automation Tests
 *
 * Key components:
 * - Test specs: tests/*.spec.ts
 * - Page Objects: pages/*.ts
 * - Test data: testdata/*.json
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,

  // Reporter configuration
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://www.originenergy.com.au',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browser support
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Timeouts
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});
