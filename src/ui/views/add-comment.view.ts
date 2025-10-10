import { ArticlePage } from '@_src/ui/pages/article.page';
import { Locator, Page } from '@playwright/test';

export class AddCommentView {
  expectedPageHeaderText = 'Add New Comment';
  pageHeader: Locator;
  private bodyInput: Locator;
  private saveButton: Locator;
  alertPopup: Locator;
  constructor(private page: Page) {
    this.pageHeader = this.page.locator('h2');
    this.bodyInput = this.page.locator('#body');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async createComment(comment: string): Promise<ArticlePage> {
    await this.bodyInput.fill(comment);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
