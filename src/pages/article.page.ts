import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/article.html';
  articleTitle: Locator;
  articleBody: Locator;
  deleteIcon: Locator;
  constructor(page: Page) {
    super(page);
    this.articleTitle = page.getByTestId('article-title');
    this.articleBody = page.getByTestId('article-body');
    this.deleteIcon = page.getByTestId('delete');
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => await dialog.accept());
    await this.deleteIcon.click();
  }
}
