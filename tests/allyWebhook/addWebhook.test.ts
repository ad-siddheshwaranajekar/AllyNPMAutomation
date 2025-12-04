import { test } from '@playwright/test';
import { WebhookPage } from '../../pages/webhook/webhookPage';
import { CURRENT_ENV } from '../../tests/config/env';
import { CommonUtils } from '../../utils/commonUtils';
import { SideMenuPage } from '../../pages/SideMenuPage';
import { LoginPage } from '../../pages/login/loginPage';

test.describe("Add ally webhook tests", () => {
  let sideMenuPage: SideMenuPage;
  let loginPage: LoginPage;
  let commonUtils: CommonUtils;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    commonUtils = new CommonUtils(page);

    // Login and open "Webhooks" page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openWebhooks();
  });

  test('Add new webhook with dynamic URL and select modules', async ({ page }) => {

    
    const webhookPage = new WebhookPage(page);
 await webhookPage.addWebhookBtn.waitFor({ state: 'visible', timeout: 90000 });
    await webhookPage.addWebhookBtn.click();
    // Already on Webhooks page — no navigate()
    await webhookPage.setWebhookUrl();                 // Auto-generated URL
    await webhookPage.selectModules('Transaction');    // Select module(s)

    // Select version
    await webhookPage.versionDropdown.click();
    await page.waitForTimeout(1000); // Wait for options to load
    await webhookPage.versionDropdown.selectOption("1");



    

    // Save
    await webhookPage.saveButton.click();

    // Verify success message
    await webhookPage.successMessage.waitFor({ state: 'visible', timeout: 15000 });

    const successText = await webhookPage.successMessage.textContent();
    console.log('Webhook added:', successText);
  });

 test('Validate duplicate module + URL error', async ({ page }) => {
  const webhookPage = new WebhookPage(page);

  const duplicateUrl = "https://eop9lz8v5k7u4lo.m.pipedream.net";
  await webhookPage.addWebhookBtn.waitFor({ state: 'visible', timeout: 90000 });
  await webhookPage.addWebhookBtn.click();
  await webhookPage.setWebhookUrl(duplicateUrl);
  await webhookPage.selectModules('Transaction');


   // Select version
  await webhookPage.versionDropdown.click();
  await page.waitForTimeout(1000); // Wait for options to load
  await webhookPage.versionDropdown.selectOption("1");
  await webhookPage.saveButton.click();
  const errorMessage = webhookPage.duplicateErrorMessage;
  await errorMessage.waitFor({ state: 'visible', timeout: 15000 });

  const errorText = await errorMessage.textContent();
  console.log('Duplicate error message:', errorText);
}  )

test('Add webhook with multiple modules selected', async ({ page }) => {

    const webhookPage = new WebhookPage(page);

    await webhookPage.addWebhookBtn.waitFor({ state: 'visible', timeout: 90000 });
    await webhookPage.addWebhookBtn.click();

    // Auto-generate URL
    await webhookPage.setWebhookUrl();

    // Select multiple modules
    await webhookPage.selectModules('Report','Transaction');

    // Select version 1
    // await webhookPage.versionDropdown.click();
    // await webhookPage.versionDropdown.selectOption("1");

    // Save webhook
    await webhookPage.saveButton.click();

    // Validate success message
    await webhookPage.successMessage.waitFor({ state: 'visible', timeout: 15000 });

    const successText = await webhookPage.successMessage.textContent();
    console.log('Webhook added:', successText);

});



});
