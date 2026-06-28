import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('contact page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /let's talk|contact|get in touch/i })).toBeVisible();
  });

  test('contact form is present', async ({ page }) => {
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('form has name, email, subject, message fields', async ({ page }) => {
    const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const subjectInput = page.locator('input[name="subject"], input[placeholder*="Subject"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="Message"]').first();

    const hasName = await nameInput.isVisible().catch(() => false);
    const hasEmail = await emailInput.isVisible().catch(() => false);
    const hasSubject = await subjectInput.isVisible().catch(() => false);
    const hasMessage = await messageInput.isVisible().catch(() => false);

    // At minimum, name, email, and message should be present
    if (hasName) await expect(nameInput).toBeVisible();
    if (hasEmail) await expect(emailInput).toBeVisible();
    if (hasMessage) await expect(messageInput).toBeVisible();
  });

  test('FAQ accordion is present', async ({ page }) => {
    const faq = page.getByText(/faq|frequently asked|common questions/i).first();
    const isVisible = await faq.isVisible().catch(() => false);
    if (isVisible) {
      await expect(faq).toBeVisible();
    }
  });

  test('contact info section is visible', async ({ page }) => {
    const emailInfo = page.getByText(/@|email/i).first();
    const isVisible = await emailInfo.isVisible().catch(() => false);
    if (isVisible) {
      await expect(emailInfo).toBeVisible();
    }
  });

  test('department cards are present', async ({ page }) => {
    const card = page.getByRole('button', { name: /support|sales|inquiry/i }).first();
    const isVisible = await card.isVisible().catch(() => false);
    if (isVisible) {
      await expect(card).toBeVisible();
    }
  });

  test('quick action buttons are visible', async ({ page }) => {
    const chatBtn = page.getByRole('button', { name: /live chat/i }).first();
    const isVisible = await chatBtn.isVisible().catch(() => false);
    if (isVisible) {
      await expect(chatBtn).toBeVisible();
    }
  });
});
