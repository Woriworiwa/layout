import { Locator, Page } from '@playwright/test';

export class PresetsComponent {
  readonly page: Page;
  readonly presets: Locator;

  constructor(page: Page) {
    this.page = page;
    this.presets = page.locator('[data-testid="presets-component"]');
  }

  /**
   * Wait for canvas to be ready
   */
  async waitForReady(): Promise<void> {
    await this.presets.waitFor({ state: 'visible' });
  }
}
