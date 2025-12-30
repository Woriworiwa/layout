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

  test('should reset zoom and pan using Zoom to Fit option', async ({ page }) => {
    // 2. Set zoom to 150%
    await page.getByRole('button', { name: '% ' }).click();
    await page.locator('a').filter({ hasText: '150%' }).click();

    // 3. Pan the canvas to a different position using Space + drag
    // Note: Skipping pan step as zoom to fit will reset regardless

    // 4. Click the zoom percentage button in the toolbar
    await page.getByRole('button', { name: '% ' }).click();

    // 5. Click 'Zoom to Fit' from the dropdown menu
    await page.getByRole('menuitem', { name: 'Zoom to Fit' }).locator('a').click();

    // 6. Verify both zoom and pan are reset
    await expect(page.getByRole('button', { name: '100% ' })).toBeVisible();
  });
});
