import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('checkout page redirects unauthenticated users', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/sign-in|signin|auth|login/);
  });

  test('checkout API returns 401 without auth', async ({ request }) => {
    const response = await request.post('/api/checkout', { data: {} });
    expect(response.status()).toBe(401);
  });
});
