import { test } from '@playwright/test';
import { AppPage } from '../../page-objects/app.page';

test.describe('Add Text Element from Presets Panel', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
    await app.clearCanvas();
  });

  test('WHEN user drags Text preset SHOULD add Text element to canvas', async () => {
    const textPreset = await app.presets.dragPreset('text');

    await textPreset.dragTo(await app.canvas.getLocator());
  });
});
