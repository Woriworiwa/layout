import { Page } from '@playwright/test';

/**
 * Page Object for Pan-Zoom functionality
 * Mirrors the structure of libs/canvas/pan-zoom/
 */
export class PanZoomComponent {
  constructor(private readonly page: Page) {}

  /**
   * Pan the canvas using space key + mouse drag
   */
  async panWithSpaceAndMouse(deltaX: number, deltaY: number): Promise<void> {
    const overlay = this.page.locator('[data-testid="canvas-overlay"]');

    // Press and hold space
    await this.page.keyboard.down('Space');

    // Wait for pan mode to activate (overlay becomes visible)
    await overlay.waitFor({ state: 'visible' });

    await this.page.waitForTimeout(400);

    const box = await overlay.boundingBox();
    if (!box) {
      throw new Error('Canvas overlay not found');
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Move mouse to starting position
    await this.page.mouse.move(startX, startY);

    // Mouse down, drag, and release
    await this.page.mouse.down();
    await this.page.mouse.move(startX + deltaX, startY + deltaY, { steps: 10 });
    await this.page.mouse.up();

    // Release space key
    await this.page.keyboard.up('Space');

    // Wait for overlay to hide (pan mode deactivated)
    await overlay.waitFor({ state: 'hidden' });
  }

  /**
   * Activate pan mode from the toolbar button
   */
  async activatePanMode(): Promise<void> {
    const canvasToolbar = this.page.locator('app-canvas-toolbar');
    const panButton = canvasToolbar.getByLabel('Pan').getByRole('button');
    await panButton.click();
  }

  /**
   * Pan the canvas using mouse drag (when pan mode is active via toolbar)
   */
  async panWithMouse(deltaX: number, deltaY: number): Promise<void> {
    const canvas = this.page.locator('[data-testid="canvas-component"]');
    const box = await canvas.boundingBox();
    if (!box) {
      throw new Error('Canvas not found');
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Move mouse to starting position
    await this.page.mouse.move(startX, startY);

    // Mouse down, drag, and release
    await this.page.mouse.down();
    await this.page.mouse.move(startX + deltaX, startY + deltaY, { steps: 10 });
    await this.page.mouse.up();
  }

  /**
   * Pan using space key while hovering over a selected text item
   */
  async panWithSpaceOverSelectedItem(
    itemLabel: string,
    deltaX: number,
    deltaY: number,
  ): Promise<void> {
    const item = this.page.locator(`${itemLabel}`);

    // Get item position
    const box = await item.boundingBox();
    if (!box) {
      throw new Error(`Item with label "${itemLabel}" not found`);
    }

    const itemX = box.x + box.width / 2;
    const itemY = box.y + box.height / 2;

    // Move mouse over the item
    await this.page.mouse.move(itemX, itemY);

    // Press and hold space
    await this.page.keyboard.down('Space');

    // Wait for pan mode to activate
    const overlay = this.page.locator('[data-testid="canvas-overlay"]');
    await overlay.waitFor({ state: 'visible' });

    await this.page.waitForTimeout(400);

    // Mouse down, drag, and release
    await this.page.mouse.down();
    await this.page.mouse.move(itemX + deltaX, itemY + deltaY, { steps: 10 });
    await this.page.mouse.up();

    // Release space key
    await this.page.keyboard.up('Space');

    // Wait for overlay to hide
    await overlay.waitFor({ state: 'hidden' });
  }

  /**
   * Get the current pan-zoom transform values from the DOM
   */
  async getTransform(): Promise<{ x: number; y: number; scale: number }> {
    const rootElement = this.page.locator('[data-testid="canvas-root-element"]');
    return rootElement.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform;
      if (transform === 'none') {
        return { x: 0, y: 0, scale: 1 };
      }

      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (!matrix) {
        return { x: 0, y: 0, scale: 1 };
      }

      const values = matrix[1].split(',').map((v) => parseFloat(v.trim()));
      return {
        x: values[4] || 0,
        y: values[5] || 0,
        scale: values[0] || 1,
      };
    });
  }
}
