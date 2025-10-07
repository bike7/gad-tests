import { AddArticleModel } from '@_src/ui/models/article.model';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { Locator, Page } from '@playwright/test';

export class AddArticleView {
  expectedPageHeaderText = 'Add New Entry';
  pageHeader: Locator;
  private titleInput: Locator;
  private bodyInput: Locator;
  private saveButton: Locator;
  alertPopup: Locator;
  constructor(private page: Page) {
    this.pageHeader = this.page.locator('h2');
    this.titleInput = this.page.getByTestId('title-input');
    this.bodyInput = this.page.getByTestId('body-text');
    this.saveButton = this.page.getByTestId('save');
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async createArticle(addArticle: AddArticleModel): Promise<ArticlePage> {
    await this.titleInput.fill(addArticle.title);
    await this.bodyInput.fill(addArticle.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
