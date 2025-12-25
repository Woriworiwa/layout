import { test, expect, Page } from '@playwright/test';
import { DesignerPage } from '../../page-objects/designer.page';

test.describe('Canvas Space Pan', () => {
  let designer: DesignerPage;

  test.beforeEach(async ({ page }) => {
    designer = new DesignerPage(page);
    await designer.goto();
    await designer.clearCanvas();
  });

  test.describe('WHEN user holds space and drags with mouse', () => {
    test('SHOULD pan the canvas in the drag direction', async () => {
      // Get initial transform state
      const initialTransform = await designer.canvas.panZoom.getTransform();

      // Hold space and drag mouse to pan the canvas
      await designer.canvas.panZoom.panWithSpaceAndMouse(150, 100);

      // Get new transform state
      const newTransform = await designer.canvas.panZoom.getTransform();

      // Verify canvas has panned in the expected direction
      expect(newTransform.x).toBeGreaterThan(initialTransform.x);
      expect(newTransform.y).toBeGreaterThan(initialTransform.y);
    });
  });
});
