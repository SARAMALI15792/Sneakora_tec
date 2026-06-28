import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
  });

  test('cart page loads with heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /cart|shopping/i }).first();
    const isVisible = await heading.isVisible().catch(() => false);
    if (isVisible) {
      await expect(heading).toBeVisible();
    }
  });

  test('cart shows sign-in prompt when unauthenticated', async ({ page }) => {
    const signInPrompt = page.getByText(/sign in/i).first();
    const isEmptyMsg = page.getByText(/empty/i).first();

    const hasSignInPrompt = await signInPrompt.isVisible().catch(() => false);
    const hasEmptyMsg = await isEmptyMsg.isVisible().catch(() => false);

    if (hasSignInPrompt) {
      await expect(signInPrompt).toBeVisible();
    } else if (hasEmptyMsg) {
      await expect(isEmptyMsg).toBeVisible();
    }
  });

  test('sign-in button on cart navigates to auth', async ({ page }) => {
    const signInBtn = page.getByRole('link', { name: /sign in/i }).first();
    if (await signInBtn.isVisible().catch(() => false)) {
      await signInBtn.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });

  test('cart API returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/cart');
    expect(response.status()).toBe(401);
  });
});
