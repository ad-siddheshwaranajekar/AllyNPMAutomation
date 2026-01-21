import { Page, Locator, expect } from "@playwright/test";

export class WebhookEventDetailsPage1 {
readonly page: Page;
readonly transactionIdValue: Locator;
readonly statusValue: Locator;

constructor(page: Page) {
  this.page = page;

  this.transactionIdValue = page
    .locator("span.row-value span.cap-ellipsis")
    .first();

  this.statusValue = page
    .locator("#user-status .status-text");
}

/**
 * Validate Event Details page loaded
 */
async validatePageLoaded() {
  await expect(this.transactionIdValue).toBeVisible({ timeout: 15000 });
}

/**
 * Read Transaction ID from Event Details page
 */
async getTransactionId(): Promise<string> {
  await this.validatePageLoaded();
  return (await this.transactionIdValue.innerText()).trim();
}

/**
 * Read Status from Event Details page */
async getStatus(): Promise<string> {
  const statusText = await this.statusValue.textContent();

return statusText?.trim() || "";
  // await this.validatePageLoaded();
  // return (await this.statusValue.textContent())?.trim() || "";
}

}
