import { test, expect } from "@playwright/test";
import { PaymentsPage } from "../../pages/payments/paymentsPage";
import { WebhookEventPage } from "../../pages/webhook/webhookEventPage";
import { WebhookEventDetailsPage1 } from "../../pages/webhook/WebhookEventDetailsPage1";
import { CURRENT_ENV } from "../../tests/config/env";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { LoginPage } from "../../pages/login/loginPage";
import { CommonUtils } from "../../utils/commonUtils";

test.describe("Payments Module", () => {
let loginPage: LoginPage;
let sideMenuPage: SideMenuPage;
let paymentsPage: PaymentsPage;
let commonUtils: CommonUtils;

test.beforeEach(async ({ page }) => {
loginPage = new LoginPage(page);
sideMenuPage = new SideMenuPage(page);
paymentsPage = new PaymentsPage(page);
commonUtils = new CommonUtils(page);

// Login and navigate to Payments page
await loginPage.navigateTo(CURRENT_ENV);
await loginPage.loginAsAlly();
await sideMenuPage.openPayments();
});

test("Validate Transaction OnSuccess webhook matches payment", async ({
page,
}) => {
test.setTimeout(90000);
const webhooksEventPage = new WebhookEventPage(page);
const webhookDetailsPage = new WebhookEventDetailsPage1(page);

//  Save Transaction ID from Payments page
await page.waitForTimeout(2000);
await paymentsPage.validatePaymentsPageLoaded();
const paymentTxnId = await paymentsPage.saveFirstTransactionId();
console.log("Payment Transaction ID:", paymentTxnId);

//  Go to Webhooks page
await sideMenuPage.openWebhookEventLogs();
await paymentsPage.validateItemsPerPageOptions();

await webhooksEventPage.validateWebhookEventsPageLoaded();
await page.waitForTimeout(2000);

let matched = false;
let startIndex = 0;

//  Loop until match found or rows exhausted
while (true) {
  const clickedIndex =
    await webhooksEventPage.openNextTransactionSuccessWebhook(startIndex);

  // Wait 2 seconds for details to load
  await page.waitForTimeout(2000);

  //  No more matching rows
  if (clickedIndex === null) break;

  //  Read Transaction ID from Event Details
  const webhookTxnId = await webhookDetailsPage.getTransactionId();
  console.log(
    `Webhook Transaction ID (row ${clickedIndex}):`,
    webhookTxnId,
  );

  // read status and print on console

const status = await webhookDetailsPage.getStatus();
console.log("Webhook Status:", status);

  //  Compare
  if (webhookTxnId === paymentTxnId) {
    matched = true;
    console.log("Match found on webhook event details page for selected Transaction ID:", webhookTxnId);
    break;
  }

  //  NOT MATCH → go back to webhook table
  await page.goBack();

  //  Wait for table to reload
  await webhooksEventPage.waitForTableReload();

  // Continue search from next row
  startIndex = clickedIndex + 1;
}
// status validation


// Final assertion
expect(
  matched,
  `No matching webhook found for Transaction ID: ${paymentTxnId}`,
).toBeTruthy();
}); //g
});
