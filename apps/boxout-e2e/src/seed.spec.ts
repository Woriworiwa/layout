import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app.page';

test.describe('Test group', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('seed', async ({ page }) => {
    // generate code here.
  });
});
