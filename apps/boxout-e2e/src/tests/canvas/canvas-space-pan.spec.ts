import { test, expect } from '@playwright/test';
import { AppPage } from '../../page-objects/app.page';

test.describe('Canvas Space Pan', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
    await app.clearCanvas();
  });

  test.describe('WHEN user holds space and drags with mouse', () => {
    test('SHOULD pan the canvas in the drag direction', async () => {
      // Get initial transform state
      const initialTransform = await app.canvas.panZoom.getTransform();

      // Hold space and drag mouse to pan the canvas
      await app.canvas.panZoom.panWithSpaceAndMouse(150, 100);

      // Get new transform state
      const newTransform = await app.canvas.panZoom.getTransform();

      // Verify canvas has panned in the expected direction
      expect(newTransform.x).toBeGreaterThan(initialTransform.x);
      expect(newTransform.y).toBeGreaterThan(initialTransform.y);
    });
  });
});
