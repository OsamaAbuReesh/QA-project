import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { AddToCartPage } from '../pages/add-to-cart-page';

test.describe('Remove from cart Feature', () => {
  let loginPage: LoginPage;
  let addToCartPage: AddToCartPage;
  

  
  async function addProductToCartAndGoToCart() {
    await addToCartPage.addToCart();
    await addToCartPage.cartLink.click();
    await expect(addToCartPage.page).toHaveURL(/.*cart/);
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    addToCartPage = new AddToCartPage(page);
    

    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await loginPage.expectSuccess();

   
  });

  test('Remove a product from the Cart page', async ({ page }) => {
    await addProductToCartAndGoToCart();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    const cartBadge = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartBadge).toHaveText('');
    const removedItem = page.locator('.cart_item:has-text("Sauce Labs Backpack")');
    await expect(removedItem).toHaveCount(0);
  });

  test('Remove one product and verify the other remains', async ({ page }) => {
  
  await addToCartPage.addSpecificProduct('sauce-labs-backpack');
  await addToCartPage.addSpecificProduct('sauce-labs-bike-light');
  
  await addToCartPage.cartLink.click();
  await expect(page).toHaveURL(/.*cart/);
  
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
 
  const removedItem = page.locator('.cart_item:has-text("Sauce Labs Backpack")');
  await expect(removedItem).toHaveCount(0);
  
  const remainingItem = page.locator('.cart_item:has-text("Sauce Labs Bike Light")');
  await expect(remainingItem).toHaveCount(1);
});

 test('Remove product From Inventory Page', async ({ page }) => {
 const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  await addButton.click();

  const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
  await expect(removeButton).toBeVisible();

  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');
  await removeButton.click();
  await expect(addButton).toBeVisible();
  await expect(cartBadge).toHaveCount(0);
 
});

  
});