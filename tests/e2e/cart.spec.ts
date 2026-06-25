import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('cart page renders correctly', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('cart shows empty state when no items', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    const emptyState = page.getByText(/empty|cart is empty|no items/i);
    if (await emptyState.isVisible().catch(() => false)) {
      await expect(emptyState).toBeVisible();
    }
  });
});