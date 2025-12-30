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

  test('should zoom out using Zoom Out menu option', async ({ page }) => {
    // 2. Set zoom to 150% using the zoom menu
    await page.getByRole('button', { name: '% ' }).click();
    await page.locator('a').filter({ hasText: '150%' }).click();

    // 3. Click the zoom percentage button in the toolbar
    await page.getByRole('button', { name: '% ' }).click();

    // 4. Click 'Zoom Out' from the dropdown menu
    await page.getByRole('menuitem', { name: 'Zoom Out' }).locator('a').click();

    // 5. Verify the zoom percentage decreases by 3% (to 147%)
    await expect(page.getByRole('button', { name: '147% ' })).toBeVisible();
  });
});
