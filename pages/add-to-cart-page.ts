import { Page, Locator, expect } from '@playwright/test';

export class AddToCartPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly itemName: Locator;
  readonly itemDesc: Locator;
  readonly itemPrice: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.itemName = page.locator('.inventory_item_name');
    this.itemDesc = page.locator('.inventory_item_desc');
    this.itemPrice = page.locator('.inventory_item_price');
    this.checkoutButton = page.locator('.checkout_button');
  }

  async addToCart() {
    await this.addToCartButton.click();
    await expect(this.removeButton).toBeVisible();
    await expect(this.cartBadge).toHaveText('1');
  }

  async addSpecificProduct(productId: string) {
  const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
  const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
  await addButton.click();
  await expect(removeButton).toBeVisible();
}

}
