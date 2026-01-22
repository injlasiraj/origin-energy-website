import { test, expect, Page } from '@playwright/test';
import { PricingPage } from '../pages/PricingPage';
import * as fs from 'fs';
import * as path from 'path';

const testDataPath = path.join(__dirname, '../testdata/addresses.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

test.describe('Origin Energy Pricing Page', () => {
  test.describe.configure({ mode: 'serial' });

  let pricingPage: PricingPage;
  let newPage: Page | null = null;
  let pdfUrl: string = '';
  let downloadedPdfPath: string = '';

  test.beforeEach(async ({ page }) => {
    pricingPage = new PricingPage(page);
    await pricingPage.navigateToPricing();
  });

  test.afterEach(async () => {
    if (newPage) {
      await newPage.close();
      newPage = null;
    }
  });

  test('Verify Gas plan details and download PDF', async ({ page }) => {
    const address = testData.gasPlan.address;
    const expectedPlanType = testData.gasPlan.expectedPlanType;

    // Search for the gas plan address
    await pricingPage.searchAddress(address);

    // Select the first address from the suggestions list
    await pricingPage.selectFirstAddressFromList();

    // Verify plans are displayed
    await pricingPage.verifyPlansDisplayed();

    // Uncheck the Electricity checkbox
    await pricingPage.uncheckElectricityCheckbox();

    // Verify plans are still displayed after filter change
    await pricingPage.verifyPlansDisplayed();

    // Click on a plan link in the BPID/EFS column
    const result = await pricingPage.clickPlanLinkInBPIDColumn();
    newPage = result.newPage;
    pdfUrl = result.pdfUrl;

    // Verify plan details page opened in a new tab
    await pricingPage.verifyNewTabOpened(newPage);

    // Download the plan PDF
    downloadedPdfPath = await pricingPage.downloadPlanPDF(pdfUrl);

    // Verify the PDF confirms the expected plan type
    await pricingPage.verifyPDFContentContains(downloadedPdfPath, expectedPlanType);
  });
});
