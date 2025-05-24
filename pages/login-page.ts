import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto(process.env.SAUCE_URL!);
    
  }

  async login(username: string, password: string) {
    if (username) {
      await this.usernameInput.fill(username);
     
    }
    if (password) {
      await this.passwordInput.fill(password);
      
    }
    await this.loginButton.click(); 
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSuccess() {
    await expect(this.page).toHaveTitle('Swag Labs');
    await expect(this.page).toHaveURL(/inventory/);
  }
}
