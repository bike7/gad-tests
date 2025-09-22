import { Locator, Page, expect } from '@playwright/test';

export class MainMenuComponent {
  commentsButton: Locator;
  articlesButton: Locator;
  homePageLink: Locator;
  constructor(private page: Page) {
    this.commentsButton = this.page.getByTestId('open-comments');
    this.articlesButton = this.page.getByTestId('open-articles');
    this.homePageLink = this.page.getByRole('link', { name: 'GAD' });
  }
  async clickCommentsButton(): Promise<void> {
    await this.commentsButton.click();
    await expect(this.commentsButton).toBeDisabled();
  }
  async clickArticlesButton(): Promise<void> {
    await this.articlesButton.click();
    await expect(this.articlesButton).toBeDisabled();
  }
  async clickHomePageLink(): Promise<void> {
    await this.homePageLink.click();
    await expect(this.articlesButton).toBeHidden();
  }
}
