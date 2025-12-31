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

  test.describe('WHEN user activates pan mode from toolbar', () => {
    test('SHOULD be able to pan by holding mouse and dragging', async () => {
      // Activate pan mode from toolbar
      await app.canvas.panZoom.activatePanMode();

      // Get initial transform state
      const initialTransform = await app.canvas.panZoom.getTransform();

      // Pan by holding mouse and dragging
      await app.canvas.panZoom.panWithMouse(150, 100);

      // Get new transform state
      const newTransform = await app.canvas.panZoom.getTransform();

      // Verify canvas has panned in the expected direction
      expect(newTransform.x).toBeGreaterThan(initialTransform.x);
      expect(newTransform.y).toBeGreaterThan(initialTransform.y);
    });
  });

  test.describe('WHEN user holds space over a selected text item', () => {
    test('SHOULD still be able to pan the canvas', async () => {
      // Insert a text item from presets by dragging
      const textPreset = await app.presets.dragPreset('text');
      await textPreset.dragTo(await app.canvas.getLocator());

      // Wait for item to appear
      await expect(app.canvas.canvas.locator('app-text')).toBeVisible();

      // Select the text item
      // await app.canvas.selectItem('Text');

      // Get initial transform state
      const initialTransform = await app.canvas.panZoom.getTransform();

      // Hold space while hovering over selected text and pan
      await app.canvas.panZoom.panWithSpaceOverSelectedItem('app-text', 150, 100);

      // Get new transform state
      const newTransform = await app.canvas.panZoom.getTransform();

      // Verify canvas has panned despite being over a selected text item
      expect(newTransform.x).toBeGreaterThan(initialTransform.x);
      expect(newTransform.y).toBeGreaterThan(initialTransform.y);
    });
  });
});
