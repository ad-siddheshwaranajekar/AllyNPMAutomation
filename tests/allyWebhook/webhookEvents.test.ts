import { test, expect } from "@playwright/test";
import { CURRENT_ENV } from "../../tests/config/env";
import { CommonUtils } from "../../utils/commonUtils";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { LoginPage } from "../../pages/login/loginPage";
import { WebhookEventPage } from "../../pages/webhook/webhookEventPage";

test.describe("Verify ally webhook event logs page", () => {
  let sideMenuPage: SideMenuPage;
  let loginPage: LoginPage;
  let commonUtils: CommonUtils;
  let webhookEventPage: WebhookEventPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    commonUtils = new CommonUtils(page);
    webhookEventPage = new WebhookEventPage(page);

    // Login and open "Webhooks Events Logs" page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openWebhookEventLogs();
  });

  test("Verify that clicking on actions ellipsis opens menu on Webhook Events page", async ({
    page,
  }) => {
    const webhookEventPage = new WebhookEventPage(page);

    await expect(webhookEventPage.webhookEventsHeader).toBeVisible({
      timeout: 15000,
    });
    await webhookEventPage.ellipsisButton.click({ delay: 1000 });
    await expect(webhookEventPage.actionsMenu).toBeVisible({ timeout: 15000 });
    await expect(webhookEventPage.retriggerOption).toBeVisible({
      timeout: 15000,
    });
    await expect(webhookEventPage.viewOption).toBeVisible({ timeout: 15000 });
  });
});
