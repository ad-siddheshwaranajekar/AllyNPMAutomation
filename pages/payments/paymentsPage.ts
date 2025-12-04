import { Page, Locator, expect } from '@playwright/test';
import { CommonUtils } from '../../utils/commonUtils';

import { BasePage } from '../basePage';

export class PaymentsPage extends BasePage {
  readonly page: Page;
  readonly utils: CommonUtils;
  //payemnt table
  readonly headerTxt: Locator;
  readonly filterTable: Locator;
  readonly transactionsTable: Locator;
// Search 
  readonly searchInput: Locator;    
  readonly searchButton: Locator;
  readonly resultsRows: Locator;
//count
  readonly transactionCount: Locator;

  //header name
  readonly headerName: Locator;
  //No Results Found
  readonly noResultsFound: Locator;

  // Sorting validation to be added later
// Headers
  readonly headerDBAName: Locator;
  readonly headerShopperName: Locator;
// Row columns
  readonly colDBAName: Locator;
  readonly colShopperName: Locator;
  //sub record row for refund search validation
  readonly subRecordRow: Locator;




  constructor(page: Page) {
    super(page);
    this.page = page;
    this.utils = new CommonUtils(page);

    this.headerTxt = page.getByRole('heading', { name: /Welcome,/, exact: false });
    this.filterTable = page.locator('div.filter-container');
    this.transactionsTable = page.locator('div.table-container');

    this.searchInput = page.locator('#searchInput');
    this.searchButton = page.locator('#searchBtn');
    this.resultsRows = page.locator('div.table-container table tbody tr');

    this.headerName = page.locator('div.table-container table thead tr th');



    this.transactionCount = page.getByText('Transactions:');
    // No Results Found locator
    this.noResultsFound = page.getByRole('heading', { name: 'No Results Found' });
  
/// Sorting validation to be added later
// Headers
    this.headerDBAName = page.locator('div.table-container table thead tr th', { hasText: 'DBA Name' });
    this.headerShopperName = page.locator('div.table-container table thead tr th', { hasText: 'Shopper Name' });
// Row columns
    this.colDBAName = page.locator('div.table-container table tbody tr td:nth-child(1)');
    this.colShopperName = page.locator('div.table-container table tbody tr td:nth-child(2)');
    this.subRecordRow = page.locator('.table-container').nth(1).locator('tbody tr').nth(1);


     // search input and button
  }
 async searchTransaction(text: string) {
  await this.utils.waitForVisible(this.searchInput, 10000);
  await this.utils.fill(this.searchInput, text);   // highlight + fill
  // Trigger search by pressing Enter first, then fallback to clicking the button
  await this.searchInput.press('Enter');
  try {
    // Wait for either results OR the "No Results Found" heading
    await Promise.race([
      this.utils.waitForVisible(this.resultsRows.first(), 30000),
      this.utils.waitForVisible(this.noResultsFound, 30000)
    ]);
  } catch (e) {
    // if neither appeared after Enter, try clicking the search button
    await this.utils.click(this.searchButton);
    await Promise.race([
      this.utils.waitForVisible(this.resultsRows.first(), 30000),
      this.utils.waitForVisible(this.noResultsFound, 30000)
    ]);
  }
 }

 async validateSearchResultsContain(text: string) {
  await this.utils.waitForVisible(this.resultsRows.first(), 90000);

  const rowCount = await this.resultsRows.count();
  expect(rowCount).toBeGreaterThan(0);

  let found = false;

  for (let i = 0; i < rowCount; i++) {
    const rowText = await this.resultsRows.nth(i).innerText();
    if (rowText.toLowerCase().includes(text.toLowerCase())) {
      found = true;
      break;
    }
  }

  if (!found) {
    // Collect sample rows for diagnostic purposes
    const sampleRows = await this.resultsRows.allInnerTexts();
    const sample = sampleRows.slice(0, Math.min(5, sampleRows.length));
    throw new Error(`No search results contained "${text}". rowCount=${rowCount} sampleRows=${JSON.stringify(sample)}`);
  }
}


//  async validateSearchResultsContain(text: string) {

//   await this.utils.waitForVisible(this.resultsRows.first(), 90000);
//   const rowCount = await this.resultsRows.count();
//   expect(rowCount).toBeGreaterThan(0);

//   for (let i = 0; i < rowCount; i++) {
//     const rowText = await this.resultsRows.nth(i).innerText();
//     expect(rowText.toLowerCase()).toContain(text.toLowerCase());
//   }
// }
 

// Validate that Payments Page loads correctly

  async validatePaymentsPageLoaded() {
    // Wait for visibility
    await this.utils.waitForVisible(this.headerTxt, 15000);
    await this.utils.waitForVisible(this.filterTable, 15000);
    await this.utils.waitForVisible(this.transactionsTable, 15000);

  
    await expect(this.headerTxt).toBeVisible();
    await expect(this.filterTable).toBeVisible();
    await expect(this.transactionsTable).toBeVisible();
  }

 // Validate that transaction count is visible
  async validateTransactionCountVisible() {
    await this.utils.waitForVisible(this.transactionCount, 15000);
    await expect(this.transactionCount).toBeVisible();
  }

//header name validation
  async validatePaymentSTableHeaderName() {

    const expectedHeaderNames = ['DBA Name', 'Shopper Name', 'Method','ACH/Card #',
      'Merchant Ref','Ref ID',  'Ref Value','Transaction Id','Date','Status'];


      for (const headerName of expectedHeaderNames) {
            const headerLocator = this.page.locator('div.table-container table thead tr th', { hasText: headerName });
        await this.utils.waitForVisible(headerLocator, 10000);
        await expect(headerLocator).toBeVisible();
      }

    }
   async validateNoSearchResults() {
    // searchTransaction already waits for "No Results Found" to appear
    // Just verify it's visible now
    await expect(this.noResultsFound).toBeVisible();
  }
  

//sorting validation to be added later
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



 
//  NOTE >> DO NOT Update under this Refund search validation
  // Validate Refund Transaction and Nested Refund Settlement Row
    async validateRefundFlow(searchText: string, expectedMainStatus: string, expectedNestedStatus: string) {
      
      // 1️⃣ Wait for table to load
      await this.page.waitForSelector('div.table-container table tbody tr');

      // 2️⃣ Try matching full ID first
      let mainRow = this.page.locator('tbody tr', { hasText: searchText }).first();

      if (!(await mainRow.count())) {
        // 3️⃣ If full ID not found, match first 8–12 characters
        const partialId = searchText.substring(0, 10);  // UI probably displays a short version
        mainRow = this.page.locator('tbody tr', { hasText: partialId }).first();
      }

      // 4️⃣ If still no match → FAIL EARLY with meaningful message
      await expect(mainRow, `No matching main row found for ID: ${searchText}`).toHaveCount(1);

      // 5️⃣ Wait for the row to become visible
      await mainRow.waitFor({ state: 'visible', timeout: 30000 });

      // 6️⃣ Validate main status (column #9)
      const mainStatusText = (await mainRow.locator('td').nth(9).innerText()).trim();
      expect(mainStatusText).toBe(expectedMainStatus);

      // 7️⃣ Expand main row
      await mainRow.click();

      // 8️⃣ Wait for nested refund row
      const nestedRow = mainRow.locator('xpath=following-sibling::tr[contains(@class,"nested-row")]').first();
      await nestedRow.waitFor({ state: 'visible', timeout: 30000 });

      // 9️⃣ Validate nested status
      await expect(nestedRow).toContainText(expectedNestedStatus);
    }
  // //*********************************************************************************************** */




}