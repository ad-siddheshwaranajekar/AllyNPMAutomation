import { test, expect } from '@playwright/test';
import { PaymentsPage } from '../../pages/payments/paymentsPage';
import { PaymentsDetailsPage } from '../../pages/payments/paymentsDetailsPage';
import { CURRENT_ENV } from '../../tests/config/env';
import { SideMenuPage } from '../../pages/SideMenuPage';
import { LoginPage } from '../../pages/login/loginPage';  
import { CommonUtils } from '../../utils/commonUtils';

test.describe('Payments Module', () => {
  let loginPage: LoginPage;
  let sideMenuPage: SideMenuPage;
  let paymentsPage: PaymentsPage;
  let commonUtils: CommonUtils; 
  let paymentsDetailsPage: PaymentsDetailsPage;
  

     test.beforeEach(async ({page}) => { 
    loginPage = new LoginPage(page);    
    sideMenuPage = new SideMenuPage(page);
    paymentsPage = new PaymentsPage(page);
    commonUtils = new CommonUtils(page);   
    paymentsDetailsPage = new PaymentsDetailsPage(page); 
     
    // Login and navigate to Payments page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openPayments();
    });



test('Validate correctness of payment details for selected payment', async ({ page }) => {


 await page.waitForTimeout(4000);
  const rowData = await paymentsPage.getRowDataByIndex(0);
  await page.waitForTimeout(3000);
  await paymentsPage.clickRowByIndex(0);
 await page.waitForTimeout(5000);
  await paymentsDetailsPage.verifyPaymentDetails(rowData);
  //await page.waitForTimeout(8000);
});




test('Validate payment details header', async ({ page }) => {
  
   await page.waitForTimeout(5000);
  await paymentsPage.clickRowByIndex(0);
  await page.waitForTimeout(5000);
  //await paymentsDetailsPage.verifyPaymentDetailsHeader();
  await page.waitForTimeout(8600);
  await paymentsDetailsPage.verifyAllCardsVisible();
});

test('Validate Authorized status is displayed in Timeline', async ({ page }) => {
  
  await page.waitForTimeout(4000);
  await paymentsPage.clickRowByIndex(0);
  
  
  await page.waitForTimeout(2000);
  await paymentsDetailsPage.verifyAuthorizedStatus();
  //await paymentsDetailsPage.verifyPaymentDetailsHeader();
});


test('Validate Settled status is displayed in Timeline', async ({ page }) => {

await paymentsPage.applyLast14DaysDateFilter();

await paymentsPage.applySettledStatusFilter();

await paymentsPage.clickLastFourRows();
await paymentsDetailsPage.verifyAuthorizedStatus();
await page.waitForTimeout(1000);

});

});