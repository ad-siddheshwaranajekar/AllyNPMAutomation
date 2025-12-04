import { test, expect } from '@playwright/test';
//import { test, expect } from '../../utils/Wrapper/customTest';
import { LoginPage } from '../../pages/login/loginPage';
import  loginData  from '../../testData/loginData.json';  

test.describe('Login Module', () => {
 
  test('Login with valid credentials @smoke @regression', async ({ page }) => {
  //test.setTimeout(70000); 

    const loginPage = new LoginPage(page); //test
  
    await loginPage.navigate();
    await loginPage.loginAsAlly(); //loginmethod called here
   // await loginPage.login(loginData[0].username, loginData[0].password);  

     const usersHeader = page.locator("//h3[normalize-space()='Users']");
    await expect(usersHeader).toBeVisible({ timeout: 15000 });
    await expect(usersHeader).toHaveText('Users');
  });

  // Negative test - invalid credentials (Regression)
  test('Login with invalid credentials @regression', async ({ page }) => {
    test.setTimeout(60000); // Entire test timeout

    const loginPage = new LoginPage(page);

    // Navigate to login page (QA or UAT)
    await loginPage.navigate();

    // Perform login with wrong credentials
    //await loginPage.login('invalidUser', 'wrongPass');
    await loginPage.login(loginData[1].username, loginData[1].password);

    // Validate error alert
    const errorAlert = page.locator(
      "//div[@role='alert' and @aria-label='We could not log you in. Please check your credentials and try again.']"
    );

    await expect(errorAlert).toBeVisible({ timeout: 15000 });
    await expect(errorAlert).toHaveText(
      'We could not log you in. Please check your credentials and try again.'
    );
 
  });
  

});
