import { test } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Login Feature', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Valid login', async () => {
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await loginPage.expectSuccess();
  });

  test('Empty username & password', async () => {
    await loginPage.login('', '');
    await loginPage.expectError('Username is required');
  });

  test('Valid username & empty password', async () => {
    await loginPage.login(process.env.SAUCE_USERNAME!, '');
    await loginPage.expectError('Password is required');
  });

  test('Empty username & valid password', async () => {
    await loginPage.login('', process.env.SAUCE_PASSWORD!);
    await loginPage.expectError('Username is required');
  });

  test('Invalid username & valid password', async () => {
    await loginPage.login('Rajaa_Ayyash', process.env.SAUCE_PASSWORD!);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('Valid username & invalid password', async () => {
    await loginPage.login(process.env.SAUCE_USERNAME!, '12345');
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('Invalid username & invalid password', async () => {
    await loginPage.login('Rajaa-Ayyash', '12345');
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('Caps Lock',async()=>{
    await loginPage.login(process.env.SAUCE_USERNAME!.toUpperCase(), process.env.SAUCE_PASSWORD!);
    await loginPage.expectError('Username and password do not match any user in this service');
  })

  test('SQL Injection',async()=>{
    await loginPage.login("' OR 1=1 --", 'password');
    await loginPage.expectError('Username and password do not match any user in this service');
  })
});
