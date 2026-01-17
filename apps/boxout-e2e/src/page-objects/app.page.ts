import { Page } from '@playwright/test';
import { CanvasComponent } from './canvas/canvas.component';
import { PresetsComponent } from './presets/presets.component';

export class AppPage {
  readonly canvas: CanvasComponent;
  readonly presets: PresetsComponent;

  constructor(public readonly page: Page) {
    this.canvas = new CanvasComponent(page);
    this.presets = new PresetsComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/design', { waitUntil: 'domcontentloaded' });
    await this.canvas.waitForReady();
    await this.dismissLandingGuide();
  }

  async isLoaded(): Promise<boolean> {
    const canvasVisible = await this.canvas.isVisible();

    return canvasVisible;
  }

  async clearCanvas(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('canvas-state');
      // Dismiss landing guide so it doesn't block interactions
      localStorage.setItem('GUIDE_DISMISSED', 'true');
    });
    await this.page.reload();
    await this.canvas.waitForReady();
  }

  async dismissLandingGuide(): Promise<void> {
    const guideLocator = this.page.locator('[data-testid="landing-guide"]');
    if (await guideLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.page.locator('[data-testid="start-blank-button"]').click();
      await guideLocator.waitFor({ state: 'hidden' });
    }
  }

  async getCanvasState(): Promise<string | null> {
    return await this.page.evaluate(() => localStorage.getItem('canvas-state'));
  }

  async hasUnsavedChanges(): Promise<boolean> {
    const state = await this.getCanvasState();
    return state !== null && state.length > 0;
  }
}
