import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../basePage";
export class WebhookEventPage extends BasePage {
  readonly webhookEventsHeader: Locator;
  readonly uRLSortIcon: Locator;
  readonly webhooksHeader: Locator;
  readonly ellipsisButton: Locator;
  readonly actionsMenu: Locator;
  readonly retriggerOption: Locator;
  readonly retriggerMessage: Locator;
  readonly viewOption: Locator;
  // Headers
  readonly headerURL: Locator;
  // Row columns
  readonly colURL: Locator;
  readonly URLText: Locator;

  constructor(page: Page) {
    super(page);

    this.webhookEventsHeader = page.locator(
      `//h3[normalize-space()='Webhook Event Logs']`
    );
    this.uRLSortIcon = page.locator(
      `//span[normalize-space()='URL']/following-sibling::div/img`
    );
    this.webhooksHeader = page.locator(`//h3[normalize-space()='Webhooks']`);
    this.ellipsisButton = page.locator(`span:has-text("")`).first();
    this.actionsMenu = page.locator(
      `//ul[contains(@class,'dropdown-menu') and contains(@class,'show')]`
    );
    this.retriggerOption = page
      .locator(`//li[contains(normalize-space(), 'Retrigger')]`)
      .first();
    this.retriggerMessage = page.getByRole('alert', { name: 'Webhook retrigger successfully' });
    this.viewOption = page
      .locator(`//li[contains(normalize-space(), 'View')]`)
      .first();

    // Headers
    this.headerURL = page.locator('div.table-container table thead tr th', { hasText: 'URL' });
    this.colURL = page.locator('div.table-container table thead tr th', { hasText: 'URL' });
    this.URLText = page.locator(`//tr//td[2]//span`).first();
    
  }

  async validateWebhookEventsPageLoaded() {
    // Wait for visibility
    await this.utils.waitForVisible(this.webhookEventsHeader, 15000);
    await expect(this.webhookEventsHeader).toBeVisible();
  }

  //header name validation
  async validateWebhookEventsTableHeaderName() {
    const expectedHeaderNames = [
      "Log Id",
      "URL",
      "Module",
      "Event",
      "Transaction ID",
      "Date Time",
      "Status",
    ];

    for (const headerName of expectedHeaderNames) {
      const headerLocator = this.page.locator(
        "div.table-container table thead tr th",
        { hasText: headerName }
      );
      await this.utils.waitForVisible(headerLocator, 10000);
      await expect(headerLocator).toBeVisible();
    }
  }

  async validateSorting(header: Locator, column: Locator) {
  // Click to sort Asc
  await header.click();
 

  const ascValues = await column.allInnerTexts();
  const sortedAsc = [...ascValues].sort((a, b) => a.localeCompare(b));

  expect(ascValues).toEqual(sortedAsc);

  // Click again to sort Desc
  await header.click();


  const descValues = await column.allInnerTexts();
  const sortedDesc = [...descValues].sort((a, b) => b.localeCompare(a));

  expect(descValues).toEqual(sortedDesc);
}

}
