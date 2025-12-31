// spec: Zoom Controls - should zoom in using Zoom In menu option
// seed: apps/boxout-e2e/src/seed.spec.ts

import { test, expect } from '@playwright/test';
import { AppPage } from '../../../page-objects/app.page';

test.describe('Zoom Controls', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('should zoom in using Zoom In menu option', async ({ page }) => {
    // 2. Note the initial zoom level (should be 100%)
    await expect(page.getByRole('button', { name: '100% ' })).toBeVisible();

    // 3. Click the zoom percentage button in the toolbar
    await page.getByRole('button', { name: '% ' }).click();

    // 4. Click 'Zoom In' from the dropdown menu
    await page.getByRole('menuitem', { name: 'Zoom In' }).click();

    // 5. Verify the zoom percentage increases by 3% (to 103%)
    await expect(page.getByRole('button', { name: '103% ' })).toBeVisible();
  });
});
