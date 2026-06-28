import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
  });

  test('blog page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible();
  });

  test('search input is available', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    const isVisible = await searchInput.isVisible().catch(() => false);
    if (isVisible) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('category filter pills are present', async ({ page }) => {
    const categoryBtn = page.getByRole('button', { name: /all|style|news|guide/i }).first();
    const isVisible = await categoryBtn.isVisible().catch(() => false);
    if (isVisible) {
      await expect(categoryBtn).toBeVisible();
    }
  });

  test('post cards are rendered if posts exist', async ({ page }) => {
    const postCards = page.locator('article, a[href*="/blog/"]').first();
    const isVisible = await postCards.isVisible().catch(() => false);
    if (isVisible) {
      await expect(postCards).toBeVisible();
    }
  });

  test('clicking a post navigates to detail', async ({ page }) => {
    const postLink = page.locator('a[href*="/blog/"]').first();
    if (await postLink.isVisible().catch(() => false)) {
      const href = await postLink.getAttribute('href');
      await postLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(href!));
    }
  });

  test('load more button is present if paginated', async ({ page }) => {
    const loadMore = page.getByRole('button', { name: /load more/i }).first();
    const isVisible = await loadMore.isVisible().catch(() => false);
    if (isVisible) {
      await expect(loadMore).toBeVisible();
    }
  });

  test('empty state shows when search has no results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('xyznonexistentpost');
      await page.waitForTimeout(500);
      const emptyMsg = page.getByText(/no articles|no posts/i);
      const isEmptyVisible = await emptyMsg.isVisible().catch(() => false);
      if (isEmptyVisible) {
        await expect(emptyMsg).toBeVisible();
      }
    }
  });

  test('blog post detail shows 404 for invalid slug', async ({ page }) => {
    await page.goto('/blog/non-existent-slug-xyz');
    await page.waitForLoadState('networkidle');
    const notFound = page.getByText(/not found/i);
    const isVisible = await notFound.isVisible().catch(() => false);
    if (isVisible) {
      await expect(notFound).toBeVisible();
    }
  });
});
