// spec: apps/boxout-e2e/src/canvas-zoom.plan.md
// seed: apps/boxout-e2e/src/seed.spec.ts

import { test, expect } from '@playwright/test';
import { AppPage } from '../../../page-objects/app.page';

test.describe('Zoom Controls', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('should display current zoom percentage in toolbar', async ({ page }) => {
    // 2. Verify initial zoom percentage displays as 100%
    await expect(page.getByRole('button', { name: '100% ' })).toBeVisible();

    // 3. Zoom in to 150% using the menu
    await page.getByRole('button', { name: '% ' }).click();
    await page.locator('a').filter({ hasText: '150%' }).click();

    // 4. Verify the toolbar button shows 150%
    await expect(page.getByRole('button', { name: '150% ' })).toBeVisible();

    // 5. Zoom out to 75% using the menu
    await page.getByRole('button', { name: '% ' }).click();
    await page.locator('a').filter({ hasText: '75%' }).click();

    // 6. Verify the toolbar button shows 75%
    await expect(page.getByRole('button', { name: '75% ' })).toBeVisible();

    // 7. Use mouse wheel to zoom and verify percentage updates in real-time
    await page.evaluate(() => {
      const canvasElement = document.getElementById('canvas-root-element');
      const wheelEvent = new WheelEvent('mousewheel', {
        deltaY: -100,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
        clientX: 500,
        clientY: 300
      });
      canvasElement!.dispatchEvent(wheelEvent);
      return { success: true };
    });

    await expect(page.getByRole('button', { name: '78% ' })).toBeVisible();
  });
});
