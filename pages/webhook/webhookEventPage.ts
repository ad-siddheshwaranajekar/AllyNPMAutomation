import { Page, Locator } from "@playwright/test";
import { BasePage } from "../basePage";
export class WebhookEventPage extends BasePage {
  
  readonly webhookEventsHeader: Locator;
  readonly uRLSortIcon: Locator;
  readonly webhooksHeader: Locator;
  readonly ellipsisButton: Locator;
  readonly actionsMenu: Locator;
  readonly retriggerOption: Locator;
  readonly viewOption: Locator;

  constructor(page: Page) {
    super(page);

    this.webhookEventsHeader = page.locator(`//h3[normalize-space()='Webhook Event Logs']`);
    this.uRLSortIcon = page.locator(`//span[normalize-space()='URL']/following-sibling::div/img`);
    this.webhooksHeader = page.locator(`//h3[normalize-space()='Webhooks']`);
    this.ellipsisButton = page.locator(`span:has-text("")`).first();
    this.actionsMenu = page.locator(`//ul[contains(@class,'dropdown-menu') and contains(@class,'show')]`);
    this.retriggerOption = page.locator(`//li[contains(normalize-space(), 'Retrigger')]`).first();
    this.viewOption = page.locator(`//li[contains(normalize-space(), 'View')]`).first();
  }
}
