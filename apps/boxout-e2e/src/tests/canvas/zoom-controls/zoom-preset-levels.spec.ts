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

  test('should set zoom to specific percentage from menu', async ({ page }) => {
    // 2. Click the zoom percentage button in the toolbar
    const zoomButton = page.getByRole('button', { name: '% ' });
    await zoomButton.click();

    // 3-4. Test each preset zoom level and verify
    // Test 50%
    await page.getByRole('menuitem', { name: '50%', exact: true }).locator('a').click();
    await expect(page.getByRole('button', { name: '50% ' })).toBeVisible();

    // Test 75%
    await zoomButton.click();
    await page.locator('a').filter({ hasText: '75%' }).click();
    await expect(page.getByRole('button', { name: '75% ' })).toBeVisible();

    // Test 100%
    await zoomButton.click();
    await page.locator('a').filter({ hasText: /^100%$/ }).click();
    await expect(page.getByRole('button', { name: '100% ' })).toBeVisible();

    // Test 125%
    await zoomButton.click();
    await page.locator('a').filter({ hasText: '125%' }).click();
    await expect(page.getByRole('button', { name: '125% ' })).toBeVisible();

    // Test 150%
    await zoomButton.click();
    await page.locator('a').filter({ hasText: '150%' }).click();
    await expect(page.getByRole('button', { name: '150% ' })).toBeVisible();

    // Test 200%
    await zoomButton.click();
    await page.locator('a').filter({ hasText: '200%' }).click();
    await expect(page.getByRole('button', { name: '200% ' })).toBeVisible();
  });
});
