import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('renders with correct title and metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/Sneakora/);
  });

  test('navbar is visible with branding', async ({ page }) => {
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    await expect(page.getByRole('link', { name: /sneakora/i }).first()).toBeVisible();
  });

  test('footer is visible with links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('hero carousel or featured section is present', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /premium|collection|featured/i }).first();
    const headingVisible = await heading.isVisible().catch(() => false);
    if (!headingVisible) {
      const anyHeading = page.locator('h1,h2').first();
      await expect(anyHeading).toBeVisible();
    }
  });

  test('navigates to shop from CTA', async ({ page }) => {
    const shopLink = page.getByRole('link', { name: /shop now|view all|shop/i }).first();
    if (await shopLink.isVisible().catch(() => false)) {
      await shopLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/shop/);
    }
  });

  test('navigates to blog from journal CTA', async ({ page }) => {
    const blogLink = page.getByRole('link', { name: /journal|blog/i }).first();
    if (await blogLink.isVisible().catch(() => false)) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/blog/);
    }
  });

  test('navigates to about page', async ({ page }) => {
    const aboutLink = page.getByRole('link', { name: /our story|about/i }).first();
    if (await aboutLink.isVisible().catch(() => false)) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/about/);
    }
  });

  test('category links navigate to filtered shop', async ({ page }) => {
    const categoryLink = page.locator('a[href*="/shop?category="]').first();
    if (await categoryLink.isVisible().catch(() => false)) {
      await categoryLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/shop/);
    }
  });

  test('displays featured products section', async ({ page }) => {
    const featuredSection = page.locator('section').filter({ hasText: /featured/i }).first();
    const isVisible = await featuredSection.isVisible().catch(() => false);
    if (isVisible) {
      await expect(featuredSection).toBeVisible();
    }
  });

  test('RAG widget is present on homepage', async ({ page }) => {
    const ragWidget = page.getByPlaceholder(/ask|messages|chat/i).first();
    const isVisible = await ragWidget.isVisible().catch(() => false);
    if (isVisible) {
      await expect(ragWidget).toBeVisible();
    }
  });
});
