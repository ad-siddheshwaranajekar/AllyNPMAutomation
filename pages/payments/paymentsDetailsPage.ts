import { Locator, Page,expect } from "@playwright/test";











export class PaymentsDetailsPage {
    readonly page: Page;

    readonly paymentsDetailsHeader: Locator;  
    
    
    readonly detailsContainer: string = '.details-container';
    readonly cardLocator: string = '.details-card';
    readonly authorizedStatus: Locator;

    

    

    constructor(page: Page) {
        this.page = page;
        this.paymentsDetailsHeader = page.getByRole('heading', { name: 'Payment Details', level: 3 });
        this.authorizedStatus = page.getByText('Authorized', { exact: true });

    }





  //    async verifyPaymentDetailsHeader() {
  //   await expect(this.paymentsDetailsHeader).toBeVisible();
  // }

async verifyAuthorizedStatus() {
  const authorized = this.page
    .locator('.timeline-card')
    .getByText('Authorized', { exact: true });

  // Wait up to 10s for Authorized to appear
  await expect(authorized).toBeVisible({ timeout: 10000 });
}



async verifyPaymentDetails(expectedData: any) {
  // Transaction ID
  // const transactionValue = this.page
  //   .getByText('Transaction ID')
  //   .locator('..')
  //   .locator('.row-value span.break-line');
  // const actualTransactionId = (await transactionValue.innerText()).trim();
  // console.log('Transaction ID from Payment Details:', actualTransactionId);
  // await expect(actualTransactionId.replace('', '').trim())
  //   .toBe(expectedData.transactionId);

const transactionValue = this.page
  .getByText('Transaction ID')
  .locator('..')
  .locator('.row-value span.break-line');

// ✅ WAIT HERE
await expect(transactionValue).not.toHaveText('', { timeout: 10000 });

const actualTransactionId = (await transactionValue.innerText())
  .replace('', '')
  .trim();

console.log('Transaction ID from Payment Details:', actualTransactionId);

await expect(actualTransactionId).toBe(expectedData.transactionId);



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

  // Verify that all detail cards are visible with correct headers
  async verifyAllCardsVisible() {
    const container = this.page.locator(this.detailsContainer);
    await expect(container).toBeVisible();

    const cards = container.locator(this.cardLocator);
    const cardCount = await cards.count();
    //console.log('Number of cards found:', cardCount);
    await expect(cardCount).toBe(5);

    const expectedHeaders = [
      'Transaction Details',
      'Shopper Details',
      'Payment Details',
      'Transaction Totals',
      'Timeline'
    ];

    for (let i = 0; i < expectedHeaders.length; i++) {
      const header = await cards.nth(i).locator('.details-header h5').innerText();
      console.log(`Details Section ${i + 1} header:`, header);
      await expect(header).toBe(expectedHeaders[i]);
    }
  }
  

 


  











}


  

  

