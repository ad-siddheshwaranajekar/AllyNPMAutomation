import { Page, Locator } from '@playwright/test';
import { CommonUtils } from '../utils/commonUtils';
import { th } from '@faker-js/faker';

export class SideMenuPage {
  readonly page: Page;
  readonly utils: CommonUtils;

  readonly usersMenu: Locator;
  readonly paymentsMenu: Locator; 
  readonly webhooksMenu: Locator;
  readonly webhookEventLogsMenu: Locator;
  readonly profileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page);  // ✅ FIX

    this.usersMenu = page.getByRole('link', { name: 'Users' });
    this.paymentsMenu = page.getByRole('link', { name: 'Payments' });
    this.webhooksMenu = page.getByRole('link', { name: 'Webhooks' });
    this.webhookEventLogsMenu = page.getByRole('link', { name: 'Webhook Events' });
    this.profileMenu = page.locator('p.profile-name');
  }



   private async delay() {
  await this.page.waitForTimeout(3000); // 3 sec
}
  async openUsers() {
    await this.utils.click(this.usersMenu); 
    await this.delay();  // now works
  }

  async openPayments() {
    await this.utils.click(this.paymentsMenu);
    await this.page.waitForTimeout(3000); 
    //await this.delay(); 
  } 

  async openWebhooks() {
    await this.utils.click(this.webhooksMenu);
    }
  async openWebhookEventLogs() {
    await this.utils.click(this.webhookEventLogsMenu);
  }
  async openProfile() {
    await this.utils.click(this.profileMenu);
  }
}





    

