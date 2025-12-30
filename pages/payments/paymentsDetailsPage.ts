import { Locator, Page,expect } from "@playwright/test";











export class PaymentsDetailsPage {
    readonly page: Page;

    readonly paymentsDetailsHeader: Locator;  
    readonly ActionBtn: Locator;
    readonly  RefundBtn: Locator; 
    readonly RefundHeader: Locator;
    readonly SubTotalValue: Locator;
    readonly  PartialRefundValue: Locator;
    readonly RefundSubmitBtn: Locator;
    readonly amountTextBox: Locator;
    readonly cancelButton: Locator;
    readonly confirmrefundHeader: Locator;
    readonly ReasonDropdown: Locator;
    readonly AddtionalInfoTextBox: Locator;
    readonly SubmitButton: Locator;
    readonly RefundSuccessMessage: Locator;

    readonly TotalRefundAmount : Locator;
    readonly SubtotalRefundAmount : Locator;
    readonly RefundOf : Locator;
    readonly RemainingBalance : Locator;
    

    
    readonly detailsContainer: string = '.details-container';
    readonly cardLocator: string = '.details-card';
    readonly authorizedStatus: Locator;

    

    

    constructor(page: Page) {
        this.page = page;
        this.paymentsDetailsHeader = page.getByRole('heading', { name: 'Payment Details', level: 3 });
        this.authorizedStatus = page.getByText('Authorized', { exact: true });
        this.ActionBtn = page.locator('#actionsButton');
        this.RefundBtn = page.locator('#refundAction');
        this.RefundHeader = page.getByRole('heading', { name: 'Refund Transaction' });
        this.RefundSubmitBtn = page.getByText('Refund', { exact: true });
        this.SubTotalValue = page.locator('#select-subtotal-refund');
        this.PartialRefundValue = page.getByLabel('Partial Refund of $');
        this.amountTextBox = page.locator('#input-refund-amt');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.confirmrefundHeader = page.getByRole('heading', { name: 'Confirm Refund' });
        this.ReasonDropdown = page.locator('#refundReason');
        this.AddtionalInfoTextBox = page.getByLabel('* Additional Details');
        this.SubmitButton = page.locator(`span:has-text("Refund")`).first();
        this.RefundSuccessMessage = page.getByRole('alert', { name: 'Refund has been successfully initiated' });

        this.TotalRefundAmount = page.getByText('Total Refund of $', { exact: true });
        this.SubtotalRefundAmount = page.locator('label[for="select-subtotal-refund"]');
        this.RefundOf = page.locator('#output-net-refund');
        this.RemainingBalance = page.locator('#output-net-balance');

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
  
 

  //refund action
  async openRefundTransaction(): Promise<void> {
  await this.ActionBtn.waitFor({ state: 'visible' });
  await this.ActionBtn.click();
  await this.RefundBtn.waitFor({ state: 'visible' });
  await this.RefundBtn.click();
  await expect(this.RefundHeader).toBeVisible({ timeout: 5000 });
  }
  async RefundTransaction(): Promise<void> {  
  await this.RefundSubmitBtn.waitFor({ state: 'visible' });
  await this.RefundSubmitBtn.click();
}
async confirmRefundFlow(reason: string, additionalInfo: string): Promise<void> {
  //  Verify Confirm Refund header
  await expect(this.confirmrefundHeader).toBeVisible({ timeout: 5000 });
  //  Select reason
  await this.ReasonDropdown.waitFor({ state: 'visible' });
  await this.ReasonDropdown.selectOption({ label: reason });

  // Verify selected value
  await expect(this.ReasonDropdown).toHaveValue(reason);

  // Add additional info
  await this.AddtionalInfoTextBox.fill(additionalInfo);

  await this.SubmitButton.waitFor({ state: 'visible' });
  await this.SubmitButton.click();
  // Verify success message
  await expect(this.RefundSuccessMessage).toBeVisible({ timeout: 15000 });
}
 private parseAmount(amountText: string): number {
    return Number(amountText.replace(/[^0-9.]/g, ''));
 
 }
async validateSubtotalRefundBalances(): Promise<void> {
  // 1️⃣ Select Subtotal Refund
  await this.SubtotalRefundAmount.waitFor({ state: 'visible' });
  await this.SubtotalRefundAmount.click();

  // 2️⃣ Submit refund
  await this.RefundSubmitBtn.waitFor({ state: 'visible' });
  await this.RefundSubmitBtn.click();

   const refundText = await this.RefundOf.textContent();
  const remainingText = await this.RemainingBalance.textContent();

   const refundAmount = this.parseAmount(refundText ?? '');
  const remainingAmount = this.parseAmount(remainingText ?? '');

  const totalText = await this.TotalRefundAmount.textContent();
  const totalAmount = this.parseAmount(totalText ?? '');

   const expectedRemaining = Number(
    (totalAmount - refundAmount).toFixed(2)
  );

  expect(refundAmount).toBeGreaterThan(0);
  expect(remainingAmount).toBe(expectedRemaining);
}



  











}


  

  

