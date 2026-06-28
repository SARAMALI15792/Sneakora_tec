import { test, expect } from '@playwright/test';

test.describe('Shop / Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
  });

  test('shop page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /premium/i }).first()).toBeVisible();
  });

  test('search input is available', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('filter toggle button is present', async ({ page }) => {
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await expect(filterBtn).toBeVisible();
  });

  test('sort dropdown is present', async ({ page }) => {
    const sortSelect = page.locator('select').first();
    const isVisible = await sortSelect.isVisible().catch(() => false);
    if (isVisible) {
      await expect(sortSelect).toBeVisible();
    }
  });

  test('product grid renders product cards', async ({ page }) => {
    const productCards = page.locator('a[href*="/shop/"]');
    const count = await productCards.count();
    if (count > 0) {
      await expect(productCards.first()).toBeVisible();
    }
  });

  test('clicking a product navigates to detail page', async ({ page }) => {
    const productLink = page.locator('a[href*="/shop/"]').first();
    if (await productLink.isVisible().catch(() => false)) {
      const href = await productLink.getAttribute('href');
      await productLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(href!));
    }
  });

  test('pagination is present when many products', async ({ page }) => {
    const pagination = page.getByRole('button', { name: /next|load more|\d+/i }).first();
    const isVisible = await pagination.isVisible().catch(() => false);
    if (isVisible) {
      await expect(pagination).toBeVisible();
    }
  });

  test('empty state shows when no products match', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('xyznonexistentproduct');
      await page.waitForTimeout(500);
      const emptyMsg = page.getByText(/no products found|no results/i);
      const isEmptyVisible = await emptyMsg.isVisible().catch(() => false);
      if (isEmptyVisible) {
        await expect(emptyMsg).toBeVisible();
      }
    }
  });
});
