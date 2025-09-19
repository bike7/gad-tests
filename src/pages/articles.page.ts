import { Page } from '@playwright/test';

export class ArticlesPage {
  url = '/articles.html';
  constructor(private page: Page) {}
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
  }
  async title(): Promise<string> {
    return this.page.title();
  }
}
