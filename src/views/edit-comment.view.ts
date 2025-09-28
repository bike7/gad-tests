import { Locator, Page } from '@playwright/test';

export class EditCommentView {
  bodyInput: Locator;
  updateButton: Locator;
  alertPopup: Locator;
  constructor(private page: Page) {
    this.bodyInput = this.page.locator('#body');
    this.updateButton = this.page.getByTestId('update-button');
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async updateComment(updatedComment: string): Promise<void> {
    await this.bodyInput.clear();
    await this.bodyInput.fill(updatedComment);
    await this.updateButton.click();
  }
}
