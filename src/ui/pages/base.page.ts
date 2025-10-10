import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}
  url = '';
  expectedPageTitle = 'GAD';
  async goTo(parameters: string = ''): Promise<this> {
    await this.page.goto(`${this.url}${parameters}`);
    await this.page.waitForLoadState('domcontentloaded');
    return this;
  }
  async getTitle(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded');
    return this.page.title();
  }
  async waitForPageToLoadUrl(): Promise<this> {
    await this.page.waitForURL(this.url);
    return this;
  }
}
