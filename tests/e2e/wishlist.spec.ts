import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test('wishlist shows sign-in prompt when unauthenticated', async ({ page }) => {
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');
    const signInPrompt = page.getByText(/sign in to manage/i);
    await expect(signInPrompt).toBeVisible();
  });

  test('wishlist sign-in button navigates to auth', async ({ page }) => {
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');
    const signInBtn = page.getByRole('link', { name: /sign in/i }).first();
    if (await signInBtn.isVisible().catch(() => false)) {
      await signInBtn.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });

  test('wishlist returns 401 for API without auth', async ({ request }) => {
    const response = await request.get('/api/wishlist');
    expect(response.status()).toBe(401);
  });
});
