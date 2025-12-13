import { Page, Locator } from '@playwright/test';

export class AppPage {
  readonly page: Page;
  readonly greeting: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greeting = page.locator('.text-lg.font-medium');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getGreetingText(): Promise<string | null> {
    return await this.greeting.textContent();
  }
}
