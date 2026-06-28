import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  const pageRoutes = [
    { path: '/', name: 'Homepage' },
    { path: '/shop', name: 'Shop' },
    { path: '/cart', name: 'Cart' },
    { path: '/checkout', name: 'Checkout' },
    { path: '/wishlist', name: 'Wishlist' },
    { path: '/profile', name: 'Profile' },
    { path: '/blog', name: 'Blog' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/sign-in', name: 'Sign In' },
    { path: '/sign-up', name: 'Sign Up' },
  ];

  for (const route of pageRoutes) {
    test(`${route.name} at ${route.path} loads successfully (status 200)`, async ({ page }) => {
      const response = await page.request.get(route.path);
      expect(response.status()).toBe(200);
    });
  }

  test('navbar links are functional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const navLinks = page.locator('nav a[href]');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      const href = await navLinks.first().getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
        await navLinks.first().click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(href.replace(/^\/?/, '/')));
      }
    }
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.request.get('/this-route-definitely-does-not-exist');
    expect(response.status()).toBe(404);
  });
});
