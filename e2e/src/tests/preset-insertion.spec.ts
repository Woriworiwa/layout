import { test } from '@playwright/test';
import { DesignerPage } from '../page-objects/designer.page';

test.describe('Add Text Element from Presets Panel', () => {
  let designer: DesignerPage;

  test.beforeEach(async ({ page }) => {
    designer = new DesignerPage(page);
    await designer.goto();
    await designer.clearCanvas();
  });

  test('WHEN user drags Text preset SHOULD add Text element to canvas', async () => {
    const textPreset = await designer.presets.dragPreset('text');

    await textPreset.dragTo(await designer.canvas.getLocator());
  });
});
