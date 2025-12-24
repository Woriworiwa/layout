import { Page } from '@playwright/test';
import { CanvasComponent } from './components/canvas.component';
import { PresetsComponent } from './components/presets.component';

/**
 * Page Object for the Designer interface (/design route)
 * Provides access to all major components: presets, canvas, layers, properties
 */
export class DesignerPage {
  readonly canvas: CanvasComponent;
  readonly presets: PresetsComponent;

  constructor(public readonly page: Page) {
    this.canvas = new CanvasComponent(page);
    this.presets = new PresetsComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/design', { waitUntil: 'domcontentloaded' });
    await this.canvas.waitForReady();
  }

  async isLoaded(): Promise<boolean> {
    const canvasVisible = await this.canvas.isVisible();

    return canvasVisible;
  }

  async clearCanvas(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('canvas-state');
    });
    await this.page.reload();
    await this.canvas.waitForReady();
  }

  async getCanvasState(): Promise<string | null> {
    return await this.page.evaluate(() => localStorage.getItem('canvas-state'));
  }

  async hasUnsavedChanges(): Promise<boolean> {
    const state = await this.getCanvasState();
    return state !== null && state.length > 0;
  }
}
