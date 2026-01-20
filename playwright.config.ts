import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * =============================================================================
 * PLAYWRIGHT BDD CONFIGURATION
 * =============================================================================
 *
 * This configuration sets up Playwright with BDD (Behavior-Driven Development)
 * using Cucumber-style feature files and step definitions.
 *
 * Key BDD components:
 * - Feature files: features/*.feature (Gherkin syntax)
 * - Step definitions: steps/*.ts
 * - Page Objects: pages/*.ts
 */

// BDD Configuration - generates test files from feature files
const testDir = defineBddConfig({
  paths: ['features/**/*.feature'],
  steps: 'steps/**/*.ts',
  importTestFrom: 'steps/fixtures.ts',
});

export default defineConfig({
  testDir,
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
    headless: !!process.env.CI, // Headless in CI/Docker, headed locally
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // TODO: Uncomment to add more browser support
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
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },
});
