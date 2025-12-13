import { test, expect } from '@playwright/test';
import { AppPage } from '../page-objects/app.page';

test.describe('e2e', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.goto();
  });

  test('should display welcome message', async () => {
    await expect(appPage.greeting).toContainText(/boXout/);
  });
});
