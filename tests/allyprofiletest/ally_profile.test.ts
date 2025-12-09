import { test, expect } from '@playwright/test';
import { CURRENT_ENV } from '../config/env';
import { ProfilePage } from '../../pages/allyProfile/ProfilePage';
import { LoginPage } from '../../pages/login/loginPage';

test.describe("Profile Page Tests", () => {
  let loginPage: LoginPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);

    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
  });


  test("Verify logged ally deatils.@smoke @regression", async ({ page }) => {
     const profileValue = await profilePage.profileMenu.innerText();
    console.log("Profile Menu Value:", profileValue);

    // Now click on profile
    await profilePage.clickProfile();

});
      


  test("Verify Profile page loads & User details visible @smoke @regression", async ({ page }) => {
    await profilePage.clickProfile();
  await page.waitForTimeout(5000);
    const details = await profilePage.getUserDetails();
    await page.waitForTimeout(2000);
    console.log("User Details:", details);

    expect(details['Username']).toBeTruthy();
    expect(details['Email']).toContain('@');
    expect(details['Phone']).toBeTruthy();
    expect(details['Address']).toBeTruthy();
    expect(details['Password']).toBeDefined();
  });


  test("Verify Actions section (Edit User + Change Password) @regression", async () => {
  await profilePage.clickProfile();
  await profilePage.verifyActionsSection();
});


  test('Verify logout navigates to login page', async ({ page }) => {

     await page.waitForTimeout(2000);
    // Click profile menu and then logout
    await profilePage.clickLogout();

    // Validate URL contains login
    await expect(page).toHaveURL(/\.anddone\.com\/#\/login/);

    console.log('Logout successful and navigated to login page.');
  });


  test.only('Validate Ally can successfully navigate to Change Password Page Functionality. @regression @smoke', async ({ page }) => {
    await profilePage.clickProfile();
    await profilePage.clickChangePassword();
    await page.waitForTimeout(2000);
    await expect(page.getByRole("heading", { name: "Change Password" })).toBeVisible();
    await expect(page).toHaveURL(/change-password/i);
    console.log("Change Password page displayed successfully");
  });

});
