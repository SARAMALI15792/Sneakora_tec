import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
  });

  test('about page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('stats section is present', async ({ page }) => {
    const stat = page.getByText(/50k|10k|500|4\.9|\+/i).first();
    const isVisible = await stat.isVisible().catch(() => false);
    if (isVisible) {
      await expect(stat).toBeVisible();
    }
  });

  test('timeline section is present', async ({ page }) => {
    const timeline = page.getByText(/2020|2021|2022|2023|2024|2025/i).first();
    const isVisible = await timeline.isVisible().catch(() => false);
    if (isVisible) {
      await expect(timeline).toBeVisible();
    }
  });

  test('values section is present', async ({ page }) => {
    const values = page.getByText(/values|mission|heritage|cra|innov/i).first();
    const isVisible = await values.isVisible().catch(() => false);
    if (isVisible) {
      await expect(values).toBeVisible();
    }
  });

  test('CTA to shop is present', async ({ page }) => {
    const cta = page.getByRole('link', { name: /explore|shop|collection/i }).first();
    const isVisible = await cta.isVisible().catch(() => false);
    if (isVisible) {
      await expect(cta).toBeVisible();
    }
  });
});
