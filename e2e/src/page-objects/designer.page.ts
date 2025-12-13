import { Page, Locator } from '@playwright/test';
import { CanvasComponent } from './components/canvas.component';

/**
 * Page Object for the Designer page (/design route)
 * Main editor interface with all panels and canvas
 */
export class DesignerPage {
  readonly page: Page;
  readonly url: string = '/design';

  // Component objects
  readonly canvas: CanvasComponent;

  // Page-level elements
  readonly header: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize component objects
    this.canvas = new CanvasComponent(page);

    // Page-level locators
    this.header = page.locator('header');
    this.sidebar = page.locator('aside');
    this.mainContent = page.locator('main');
  }

  /**
   * Navigate to the designer page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.canvas.waitForReady();
  }
}
