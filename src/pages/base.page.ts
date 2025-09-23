import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}
  url = '';
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
  }
  async title(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded');
    return this.page.title();
  }
  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(this.url);
  }
}
