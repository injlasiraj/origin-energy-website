import { test as base, createBdd } from 'playwright-bdd';
import { PricingPage } from '../pages/PricingPage';

// Define custom fixtures type
type CustomFixtures = {
  pricingPage: PricingPage;
  // Shared state for new tab handling
  testContext: {
    newPage: any;
    pdfUrl: string;
    downloadedPdfPath: string;
    expectedPlanType: string;
  };
};

// Extend the base test with our custom fixtures
export const test = base.extend<CustomFixtures>({
  // PricingPage fixture - automatically creates a new instance for each test
  pricingPage: async ({ page }, use) => {
    const pricingPage = new PricingPage(page);
    await use(pricingPage);
  },

  // TestContext fixture - shared state between steps
  testContext: async ({}, use) => {
    const context = {
      newPage: null,
      pdfUrl: '',
      downloadedPdfPath: '',
      expectedPlanType: '',
    };
    await use(context);
  },
});

// Create BDD functions (Given, When, Then) bound to our fixtures
export const { Given, When, Then } = createBdd(test);
