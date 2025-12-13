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
    this.canvas = page.locator('[data-testid="canvas"]');
  }

  /**
   * Wait for canvas to be ready
   */
  async waitForReady(): Promise<void> {
    await this.canvas.waitFor({ state: 'visible' });
  }
}
