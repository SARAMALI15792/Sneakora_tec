import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('user can navigate between login and register', async ({ page }) => {
    await page.goto('/sign-in');
    const registerLink = page.getByRole('link', { name: /sign up|register|create account/i });
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/\/sign-up/);
    }
  });
});