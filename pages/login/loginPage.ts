import { Page, Locator } from "@playwright/test";
import { BasePage } from "../basePage";
import { CURRENT_ENV } from "../../tests/config/env";
import { CommonUtils } from "../../utils/commonUtils";
import loginData from '../../testData/loginData.json';

// Use environment variable at runtime instead of a missing module import.

export class LoginPage extends BasePage {   
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  //readonly alertMessage: Locator;

  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.url = CURRENT_ENV; // use CURRENT_ENV instead of hardcoding

    this.usernameInput = page.locator('#loginUsername'); 
    this.passwordInput = page.locator('#loginPassword');
    this.loginButton = page.locator('#login-button');
  }

  async navigate() {
    await this.navigateTo(this.url);
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.page.waitForTimeout(1000);
   // await this.page.waitForLoadState('networkidle');
  }


  async loginAsAlly() {
   // await this.navigate();
   await this.login(loginData[0].username, loginData[0].password); //both QAt and UAT
   
}
}