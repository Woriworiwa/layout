import { Locator, Page } from '@playwright/test';

/**
 * Page Object for the Canvas component
 * Handles canvas rendering and item interactions
 */
export class CanvasComponent {
  readonly page: Page;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.locator('[data-testid="canvas-component"]');
  }

  async getLocator(): Promise<Locator> {
    return this.canvas;
  }

  async waitForReady(): Promise<void> {
    await this.canvas.waitFor({ state: 'visible' });
  }

  async waitForCanvas(): Promise<void> {
    await this.waitForReady();
  }

  async isVisible(): Promise<boolean> {
    return await this.canvas.isVisible();
  }

  async getCanvasItems(): Promise<Locator[]> {
    const items = await this.canvas.locator('[data-canvas-item]').all();
    return items;
  }

  async getCanvasItemCount(): Promise<number> {
    return await this.canvas.locator('[data-canvas-item]').count();
  }

  async hasItem(label: string): Promise<boolean> {
    const item = this.canvas.locator(`[data-label="${label}"]`);
    return await item.isVisible();
  }

  async selectItem(label: string): Promise<void> {
    await this.canvas.locator(`[data-label="${label}"]`).click();
  }

  async getItemCssProperty(label: string, property: string): Promise<string> {
    const item = this.canvas.locator(`[data-label="${label}"]`);
    return await item.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }
}
