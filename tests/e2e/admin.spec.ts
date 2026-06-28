import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('admin redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/sign-in|signin|auth|login/);
  });

  test('admin/products redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/sign-in|signin|auth|login/);
  });

  test('admin/orders redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/sign-in|signin|auth|login/);
  });

  test('admin/coupons redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin/coupons');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/sign-in|signin|auth|login/);
  });

  test('admin API stats returns 401 without auth', async ({ page }) => {
    const response = await page.request.get('/api/admin/stats');
    expect(response.status()).toBe(401);
  });

  test('admin API products returns 401 without auth', async ({ page }) => {
    const response = await page.request.get('/api/admin/products');
    expect(response.status()).toBe(401);
  });

  test('admin API orders returns 401 without auth', async ({ page }) => {
    const response = await page.request.get('/api/admin/orders');
    expect(response.status()).toBe(401);
  });

  test('admin API coupons returns 401 without auth', async ({ page }) => {
    const response = await page.request.get('/api/admin/coupons');
    expect(response.status()).toBe(401);
  });
});
