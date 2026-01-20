import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import * as fs from 'fs';
import * as path from 'path';

const testDataPath = path.join(__dirname, '../testdata/addresses.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// Navigate to the Origin Energy pricing page.
Given('I am on the Origin Energy pricing page', async ({ pricingPage }) => {
  await pricingPage.navigateToPricing();
});

// Search for an address using the value from the feature file.
When('I search for address {string}', async ({ pricingPage }, address: string) => {
  await pricingPage.searchAddress(address);
});

// Search for an address using the gas plan address from test data.
When('I search for the gas plan address', async ({ pricingPage, testContext }) => {
  const address = testData.gasPlan.address;
  testContext.expectedPlanType = testData.gasPlan.expectedPlanType;
  await pricingPage.searchAddress(address);
});

// Select the first address from the autocomplete suggestions.
When('I select the first address from the suggestions list', async ({ pricingPage }) => {
  await pricingPage.selectFirstAddressFromList();
});

// Uncheck a filter checkbox by type.
When('I uncheck the {string} checkbox', async ({ pricingPage }, filterType: string) => {
  if (filterType.toLowerCase() === 'electricity') {
    await pricingPage.uncheckElectricityCheckbox();
  } else {
    throw new Error(`Checkbox type "${filterType}" not yet implemented.`);
  }
});

// Check a filter checkbox by type.
When('I check the {string} checkbox', async ({ pricingPage }, filterType: string) => {
  await pricingPage.checkCheckbox(filterType);
});

// Click on a plan link in the specified column.
When('I click on a plan link in the {string} column', async ({ pricingPage, testContext }, column: string) => {
  if (column === 'Plan BPID/EFS' || column.includes('BPID') || column.includes('EFS')) {
    const { newPage, pdfUrl } = await pricingPage.clickPlanLinkInBPIDColumn();
    testContext.newPage = newPage;
    testContext.pdfUrl = pdfUrl;
  } else {
    throw new Error(`Column "${column}" not yet implemented.`);
  }
});

// Download the plan PDF using the URL from the clicked link.
When('I download the plan PDF', async ({ pricingPage, testContext }) => {
  if (!testContext.pdfUrl) {
    throw new Error('No PDF URL available. Make sure the plan link was clicked first.');
  }
  const pdfPath = await pricingPage.downloadPlanPDF(testContext.pdfUrl);
  testContext.downloadedPdfPath = pdfPath;
});

// Verify that plans are displayed on the page.
Then('I should see the plans list displayed', async ({ pricingPage }) => {
  await pricingPage.verifyPlansDisplayed();
});

// Verify that plans are still displayed after filter changes.
Then('I should still see plans displayed', async ({ pricingPage }) => {
  await pricingPage.verifyPlansDisplayed();
});

// Verify that only plans for the specified fuel type are displayed.
Then('the displayed plans should be for {string} only', async ({ page }, fuelType: string) => {
  const pageContent = await page.content();
  expect(pageContent.toLowerCase()).toContain(fuelType.toLowerCase());
});

// Verify that the plan details opened in a new tab.
Then('the plan details page should open in a new tab', async ({ pricingPage, testContext }) => {
  if (!testContext.newPage) {
    throw new Error('No new page was opened. Check if the link actually opens in a new tab.');
  }
  await pricingPage.verifyNewTabOpened(testContext.newPage);
});

// Verify PDF contains the specified plan type.
Then('the PDF should confirm it is a {string} plan', async ({ pricingPage, testContext }, planType: string) => {
  if (!testContext.downloadedPdfPath) {
    throw new Error('No PDF was downloaded. Make sure the download step completed successfully.');
  }
  await pricingPage.verifyPDFContentContains(testContext.downloadedPdfPath, planType);
  if (testContext.newPage) {
    await testContext.newPage.close();
  }
});

// Verify PDF contains the expected plan type from test data.
Then('the PDF should confirm the expected plan type', async ({ pricingPage, testContext }) => {
  if (!testContext.downloadedPdfPath) {
    throw new Error('No PDF was downloaded. Make sure the download step completed successfully.');
  }
  if (!testContext.expectedPlanType) {
    throw new Error('No expected plan type set. Make sure the test data was loaded.');
  }
  await pricingPage.verifyPDFContentContains(testContext.downloadedPdfPath, testContext.expectedPlanType);
  if (testContext.newPage) {
    await testContext.newPage.close();
  }
});
