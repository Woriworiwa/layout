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

  test('should zoom out using mouse wheel with Ctrl key', async ({ page }) => {
    // 2. Set zoom to 150%
    await page.getByRole('button', { name: '% ' }).click();
    await page.locator('a').filter({ hasText: '150%' }).click();

    // 3-4. Hold Ctrl key and scroll mouse wheel down (positive deltaY)
    await page.evaluate(() => {
      const canvasElement = document.getElementById('canvas-root-element');
      const wheelEvent = new WheelEvent('mousewheel', {
        deltaY: 100,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
        clientX: 500,
        clientY: 300
      });
      canvasElement!.dispatchEvent(wheelEvent);
      return { success: true };
    });

    // 5. Verify zoom decreases by 3%
    await expect(page.getByRole('button', { name: '147% ' })).toBeVisible();

    // 6. Repeat scrolling down and verify continuous zoom decrease
    await page.evaluate(() => {
      const canvasElement = document.getElementById('canvas-root-element');
      const wheelEvent = new WheelEvent('mousewheel', {
        deltaY: 100,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
        clientX: 500,
        clientY: 300
      });
      canvasElement!.dispatchEvent(wheelEvent);
      return { success: true };
    });

    await expect(page.getByRole('button', { name: '144% ' })).toBeVisible();
  });
});
