import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { AddToCartPage } from '../pages/add-to-cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Checkout Feature', () => {
  let loginPage: LoginPage;
  let addToCartPage: AddToCartPage;
  let checkoutPage: CheckoutPage;

  
  async function addProductToCartAndGoToCart() {
    await addToCartPage.addToCart();
    await addToCartPage.cartLink.click();
    await expect(addToCartPage.page).toHaveURL(/.*cart/);
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    addToCartPage = new AddToCartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await loginPage.expectSuccess();

    await addProductToCartAndGoToCart();
  });

  test('valid checkout flow', async ({ page }) => {
    await addToCartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.fillCustomerInformation('Rajaa', 'Ayyash', '1234');
    await checkoutPage.continueCheckout();

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();
    await expect(page.locator('.summary_info')).toBeVisible();

    await checkoutPage.finishCheckout();

    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(page.locator('[data-test="checkout-complete-container"]')).toBeVisible();

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('checkout with all fields empty', async ({ page }) => {
    await addToCartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.continueCheckout();

    await checkoutPage.expectError('Error: First Name is required');
  });

  test('checkout with missing last name', async ({ page }) => {
    await addToCartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.fillCustomerInformation('Rajaa', '', '1234');
    await checkoutPage.continueCheckout();

    await checkoutPage.expectError('Error: Last Name is required');
  });

  test('checkout with missing postal code', async ({ page }) => {
    await addToCartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.fillCustomerInformation('Rajaa', 'Ayyash', '');
    await checkoutPage.continueCheckout();

    await checkoutPage.expectError('Error: Postal Code is required');
  });

  test('cancel from checkout step one', async ({ page }) => {
    await addToCartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('cancel from checkout step two', async ({ page }) => {
    await addToCartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.fillCustomerInformation('Rajaa', 'Ayyash', '1234');
    await checkoutPage.continueCheckout();

    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(/.*inventory/);
  });
});
