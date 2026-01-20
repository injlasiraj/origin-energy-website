import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Origin Energy Pricing Page.
 */
export class PricingPage extends BasePage {
  private readonly addressSearchInput: Locator;
  private readonly addressSuggestionsList: Locator;
  private readonly plansContainer: Locator;
  private readonly electricityCheckbox: Locator;
  private readonly planLinks: Locator;

  constructor(page: Page) {
    super(page);

    this.addressSearchInput = page.locator('input[id="address-lookup"]');
    this.addressSuggestionsList = page.locator('[id="address-lookup-listbox"], [role="listbox"][id*="address"]');
    this.plansContainer = page.locator('div[id="searchResultsContainer"] table').first();
    this.electricityCheckbox = page.locator('input[name="elc-checkbox"]').first();
    this.planLinks = page.locator('a[data-id*="Origin"]');
  }

  /** Navigate to the pricing page. */
  async navigateToPricing(): Promise<void> {
    await this.navigate('/pricing.html');
    await this.waitForPageLoad();
  }

  /** Search for an address in the search field. */
  async searchAddress(address: string): Promise<void> {
    await this.addressSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.addressSearchInput.click();
    await this.addressSearchInput.fill(address);
    await this.page.waitForTimeout(1000);
  }

  /** Select the first address from the suggestions list. */
  async selectFirstAddressFromList(): Promise<void> {
    await this.addressSuggestionsList.waitFor({ state: 'visible', timeout: 10000 });

    const firstOption = this.page.locator('[id="address-lookup-option-0"], [role="option"]:first-child');
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    await firstOption.click();
  }

  /** Verify that plans are displayed on the page. */
  async verifyPlansDisplayed(): Promise<void> {
    await this.plansContainer.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.plansContainer).toBeVisible();
  }

  /** Uncheck the Electricity checkbox. */
  async uncheckElectricityCheckbox(): Promise<void> {
    await this.electricityCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.electricityCheckbox.isChecked();

    if (isChecked) {
      await this.electricityCheckbox.click();
    }
  }

  /** Check a checkbox by filter type. */
  async checkCheckbox(filterType: string): Promise<void> {
    const checkbox = this.page.locator(`input[type="checkbox"][value*="${filterType}" i], label:has-text("${filterType}") input[type="checkbox"]`);
    await checkbox.waitFor({ state: 'visible', timeout: 10000 });

    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
      await checkbox.click();
    }
  }

  /** Click on a plan link in the BPID/EFS column. Returns the new page and PDF URL. */
  async clickPlanLinkInBPIDColumn(): Promise<{ newPage: Page; pdfUrl: string }> {
    const planLink = this.page.locator('table a[href*=".pdf"]').first();

    await planLink.waitFor({ state: 'visible', timeout: 10000 });

    const pdfUrl = await planLink.getAttribute('href');
    if (!pdfUrl) {
      throw new Error('Could not get PDF URL from plan link');
    }

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      planLink.click()
    ]);

    await newPage.waitForTimeout(2000);
    return { newPage, pdfUrl };
  }

  /** Verify that a new tab was opened. */
  async verifyNewTabOpened(newPage: Page): Promise<void> {
    expect(newPage).not.toBe(this.page);
  }

  /** Download the plan PDF and return the file path. */
  async downloadPlanPDF(pdfUrl: string): Promise<string> {
    const fs = await import('fs');
    const path = await import('path');

    const downloadsDir = path.join(process.cwd(), 'downloads');

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const urlParts = pdfUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'plan.pdf';
    const filePath = path.join(downloadsDir, fileName);

    const response = await this.page.request.get(pdfUrl);
    if (!response.ok()) {
      throw new Error(`Failed to download PDF: ${response.status()} ${response.statusText()}`);
    }

    const buffer = await response.body();
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  /** Verify that the PDF content contains the specified text. */
  async verifyPDFContentContains(filePath: string, expectedText: string): Promise<void> {
    const fs = require('fs');
    const pdfParse = require('pdf-parse');

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.toLowerCase();

    expect(text).toContain(expectedText.toLowerCase());
  }
}
