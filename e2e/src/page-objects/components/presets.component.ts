import { Locator, Page } from '@playwright/test';

export class PresetsComponent {
  readonly page: Page;
  readonly presetsPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.presetsPanel = page.locator('[data-testid="presets-component"]');
  }

  /**
   * Wait for canvas to be ready
   */
  async waitForReady(): Promise<void> {
    await this.presetsPanel.waitFor({ state: 'visible' });
  }

  async dragPreset(presetName: string) {
    return this.presetsPanel
      .locator(`[data-testid="preset-${presetName}"]`);
  }
}
