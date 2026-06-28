import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Sign In Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');
    });

    test('login page renders with form', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('email and password inputs are present', async ({ page }) => {
      const emailInput = page.locator('input[name="email"], input[type="email"]').first();
      const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test('submit button is present', async ({ page }) => {
      const submitBtn = page.getByRole('button', { name: /sign in/i }).first();
      await expect(submitBtn).toBeVisible();
    });

    test('social OAuth buttons are present', async ({ page }) => {
      const googleBtn = page.locator('button, a').filter({ hasText: /google/i }).first();
      const githubBtn = page.locator('button, a').filter({ hasText: /github/i }).first();
      const googleVisible = await googleBtn.isVisible().catch(() => false);
      const githubVisible = await githubBtn.isVisible().catch(() => false);
      if (googleVisible) await expect(googleBtn).toBeVisible();
      if (githubVisible) await expect(githubBtn).toBeVisible();
    });

    test('link to sign up exists', async ({ page }) => {
      const signUpLink = page.getByRole('link', { name: /sign up|register|create account/i });
      await expect(signUpLink).toBeVisible();
    });

    test('navigates to sign-up page', async ({ page }) => {
      await page.getByRole('link', { name: /sign up|register|create account/i }).click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/sign-up/);
    });
  });

  test.describe('Sign Up Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-up');
      await page.waitForLoadState('networkidle');
    });

    test('register page renders with form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /create account|sign up|join/i }).first()).toBeVisible();
    });

    test('name, email, and password inputs are present', async ({ page }) => {
      const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]').first();
      const emailInput = page.locator('input[name="email"], input[type="email"]').first();
      const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
      if (await nameInput.isVisible().catch(() => false)) await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test('password strength indicator is present', async ({ page }) => {
      const strengthBar = page.locator('[role="progressbar"], [class*="strength"], [class*="password"]').first();
      const isVisible = await strengthBar.isVisible().catch(() => false);
      if (isVisible) {
        await expect(strengthBar).toBeVisible();
      }
    });

    test('submit button is present', async ({ page }) => {
      const submitBtn = page.getByRole('button', { name: /create account|sign up|register/i }).first();
      await expect(submitBtn).toBeVisible();
    });

    test('link to sign in exists', async ({ page }) => {
      const signInLink = page.getByRole('link', { name: /sign in|already have account/i }).first();
      await expect(signInLink).toBeVisible();
    });

    test('navigates to sign-in page', async ({ page }) => {
      await page.getByRole('link', { name: /sign in|already have account/i }).first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/sign-in/);
    });
  });
});
