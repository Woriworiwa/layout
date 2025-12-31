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

  test('should zoom in using mouse wheel with Ctrl key', async ({ page }) => {
    // 2. Note the initial zoom level (100%)
    await expect(page.getByRole('button', { name: '100% ' })).toBeVisible();

    // 3-4. Hold Ctrl key and scroll mouse wheel up (negative deltaY)
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
    });

    // 5. Verify zoom increases by 3%
    await expect(page.getByRole('button', { name: '103% ' })).toBeVisible();

    // 6. Repeat scrolling up and verify continuous zoom increase
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
    });

    await expect(page.getByRole('button', { name: '106% ' })).toBeVisible();
  });
});
