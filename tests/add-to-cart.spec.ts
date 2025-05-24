import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { AddToCartPage } from '../pages/add-to-cart-page';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Add to Cart Feature', () => {
  let loginPage: LoginPage;
  let addToCartPage: AddToCartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    addToCartPage = new AddToCartPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await loginPage.expectSuccess();
  });

  test('Add product to the cart', async ({page}) => {
    await addToCartPage.addToCartButton.click();
    await expect(addToCartPage.removeButton).toBeVisible();
    await page.waitForTimeout(1000);

    await expect(addToCartPage.cartBadge).toHaveText('1');
    await addToCartPage.cartLink.click();
    await expect(page).toHaveURL(/.*cart/);
    await page.waitForTimeout(1000);

    await expect(addToCartPage.itemName).toHaveText('Sauce Labs Backpack');
    await expect(addToCartPage.itemDesc).toHaveText(
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
    );
    await expect(addToCartPage.itemPrice).toHaveText('$29.99');
    await expect(addToCartPage.checkoutButton).toBeVisible();
    await page.waitForTimeout(1000);
  });

  test('Add multiple products to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.waitForTimeout(1000);

    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('3');

    await page.click('.shopping_cart_link');
    await page.waitForTimeout(1000);

    const itemNames = await page.locator('.inventory_item_name').allTextContents();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
    expect(itemNames).toContain('Sauce Labs Bolt T-Shirt');
    await page.waitForTimeout(1000);
  });

  test('Prevent adding the same product twice', async ({ page }) => {
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addBtn.click();
    await page.waitForTimeout(1000);

    const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(removeBtn).toBeVisible();

    await expect(addBtn).toHaveCount(0);
    await page.waitForTimeout(1000);
  });

  test('Verify cart badge updates correctly', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.waitForTimeout(1000);

    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');
    await page.waitForTimeout(1000);
  });

  test('Add product from product details page', async ({ page }) => {
    await page.click('[data-test="item-4-title-link"]'); 
    await expect(page).toHaveURL(/.*inventory-item.html\?id=4/);
    await page.waitForTimeout(1000);

    await page.locator('[data-test="add-to-cart"]').click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    await page.click('.shopping_cart_link');
    const itemName = page.locator('.inventory_item_name');
    await expect(itemName).toHaveText('Sauce Labs Backpack');
    await page.waitForTimeout(1000);
  });

  test('Verify cart items are in correct order', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.waitForTimeout(1000);

    await page.click('.shopping_cart_link');
    const itemNames = await page.locator('.inventory_item_name').allTextContents();

    expect(itemNames[0]).toBe('Sauce Labs Bike Light');
    expect(itemNames[1]).toBe('Sauce Labs Backpack');
    expect(itemNames[2]).toBe('Sauce Labs Bolt T-Shirt');
    await page.waitForTimeout(1000);
  });
});
