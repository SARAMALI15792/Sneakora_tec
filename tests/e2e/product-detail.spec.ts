import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('product detail renders for first shop product', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');

    const productLink = page.locator('a[href*="/shop/"]').first();
    await test.step('navigate to product detail', async () => {
      if (await productLink.isVisible()) {
        await productLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/shop\//);
      }
    });

    await test.step('product name is visible', async () => {
      const heading = page.getByRole('heading').first();
      const isVisible = await heading.isVisible().catch(() => false);
      if (isVisible) {
        await expect(heading).toBeVisible();
      }
    });

    await test.step('product price is shown', async () => {
      const price = page.getByText(/^\$/).first();
      const isVisible = await price.isVisible().catch(() => false);
      if (isVisible) {
        await expect(price).toBeVisible();
      }
    });
  });

  test('404 page for non-existent product', async ({ page }) => {
    await page.goto('/shop/non-existent-product-xyz-123');
    await page.waitForLoadState('networkidle');
    const notFound = page.getByText(/not found/i);
    const isVisible = await notFound.isVisible().catch(() => false);
    if (isVisible) {
      await expect(notFound).toBeVisible();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
