import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test('profile page shows sign-in prompt when unauthenticated', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    const signInPrompt = page.getByText(/sign in to manage/i);
    await expect(signInPrompt).toBeVisible();
  });

  test('profile settings redirects unauthenticated users', async ({ page }) => {
    await page.goto('/profile/settings');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('profile orders shows sign-in prompt when unauthenticated', async ({ page }) => {
    await page.goto('/profile/orders');
    await page.waitForLoadState('networkidle');
    const signInPrompt = page.getByText(/sign in to manage/i);
    await expect(signInPrompt).toBeVisible();
  });
});
