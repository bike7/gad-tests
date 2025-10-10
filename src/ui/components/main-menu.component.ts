import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { CommentsPage } from '@_src/ui/pages/comments.page';
import { HomePage } from '@_src/ui/pages/home.page';
import { Locator, Page, expect } from '@playwright/test';

export class MainMenuComponent {
  private commentsButton: Locator;
  private articlesButton: Locator;
  private homePageLink: Locator;
  constructor(private page: Page) {
    this.commentsButton = this.page.getByTestId('open-comments');
    this.articlesButton = this.page.getByTestId('open-articles');
    this.homePageLink = this.page.getByRole('link', { name: 'GAD' });
  }
  async clickCommentsButton(): Promise<CommentsPage> {
    await this.commentsButton.click();
    await expect(this.commentsButton).toBeDisabled();
    return new CommentsPage(this.page);
  }
  async clickArticlesButton(): Promise<ArticlesPage> {
    await this.articlesButton.click();
    await expect(this.articlesButton).toBeDisabled();
    return new ArticlesPage(this.page);
  }
  async clickHomePageLink(): Promise<HomePage> {
    await this.homePageLink.click();
    await expect(this.articlesButton).toBeHidden();
    return new HomePage(this.page);
  }
}
