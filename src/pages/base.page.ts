import { Page } from '@playwright/test';

export class BasePage {
  constructor(private page: Page) {}
  url = '';
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
  }
  async title(): Promise<string> {
    return this.page.title();
  }
}
