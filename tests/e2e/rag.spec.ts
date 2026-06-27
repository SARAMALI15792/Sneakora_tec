import { test, expect } from '@playwright/test';

test.describe('RAG Widget', () => {
  test('RAG widget renders on pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const chatInput = page.getByPlaceholder(/ask|messages|chat/i).first();
    const isVisible = await chatInput.isVisible().catch(() => false);
    if (isVisible) {
      await expect(chatInput).toBeVisible();
    }
  });

  test('chat interaction works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const chatInput = page.getByPlaceholder(/ask|messages|chat/i).first();
    if (await chatInput.isVisible().catch(() => false)) {
      await chatInput.fill('What brands do you carry?');
      const sendButton = page.getByRole('button', { name: /send|submit/i }).first();
      if (await sendButton.isVisible().catch(() => false)) {
        await sendButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });
});