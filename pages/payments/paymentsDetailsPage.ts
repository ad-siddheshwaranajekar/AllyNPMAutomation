import { Page,expect } from "@playwright/test";




export class PaymentsDetailsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }


async verifyPaymentDetails(expectedData: any) {
  // Transaction ID
  const transactionValue = this.page
    .getByText('Transaction ID')
    .locator('..')
    .locator('.row-value span.break-line');
  const actualTransactionId = (await transactionValue.innerText()).trim();
  console.log('Transaction ID from Payment Details:', actualTransactionId);
  await expect(actualTransactionId.replace('', '').trim())
    .toBe(expectedData.transactionId);

  // Merchant Reference
  const merchantRefValue = this.page
    .getByText('Merchant Reference')
    .locator('..')
    .locator('.row-value');
  const actualMerchantRef = (await merchantRefValue.innerText()).trim();
  console.log('Merchant Reference from Payment Details:', actualMerchantRef);
  await expect(actualMerchantRef).toBe(expectedData.merchantRef);

  // Method
  const methodValue = this.page
    .getByText('Method')
    .locator('..')
    .locator('.row-value');
  const actualMethod = (await methodValue.innerText()).trim();
  console.log('Method from Payment Details:', actualMethod);
  await expect(actualMethod.toLowerCase()).toBe(expectedData.method.toLowerCase());


 // Status
    // const statusValue = this.page
    //   .getByText('Status')
    //   .locator('..')
    //   .locator('.row-value');
    // const actualStatus = (await statusValue.innerText()).trim();
    // console.log('Status from Payment Details:', actualStatus);
    // await expect(actualStatus).toBe(expectedData.status);
  }


}
  

  

