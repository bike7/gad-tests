import { Locator, Page } from '@playwright/test';

export class AddCommentView {
  expectedPageHeaderText = 'Add New Comment';
  pageHeader: Locator;
  commentBody: Locator;
  bodyInput: Locator;
  saveButton: Locator;
  alertPopup: Locator;
  constructor(private page: Page) {
    this.pageHeader = this.page.locator('h2');
    this.commentBody = this.page.locator('#body');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async createComment(comment: string): Promise<void> {
    await this.commentBody.fill(comment);
    await this.saveButton.click();
  }
}
