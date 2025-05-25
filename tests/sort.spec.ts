import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
test.describe('Sort Feature', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await loginPage.expectSuccess();

   
  });


test('Sort from A-Z', async ({ page }) => {
  await page.selectOption('[data-test="product-sort-container"]', 'az');

  const productNames = await page.$$eval('.inventory_item_name', items =>
    items.map(item => item.textContent?.trim() || '')
  );
  
  const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
  
  expect(productNames).toEqual(sortedNames);
});

test('Sort by Price High to Low', async ({ page }) => {
  await page.selectOption('[data-test="product-sort-container"]', 'hilo');
  const prices = await page.$$eval('.inventory_item_price', items =>
    items.map(item => parseFloat(item.textContent?.replace('$', '') || '0'))
  );

  const sortedPrices = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sortedPrices);
});

});