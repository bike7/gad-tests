import { BasePage } from './base.page';
import { MainMenuComponent } from '@_src/components/main-menu.component';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu: MainMenuComponent;
  commentBody: Locator;
  editButton: Locator;
  returnLink: Locator;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.commentBody = page.getByTestId('comment-body');
    this.editButton = page.getByTestId('edit');
    this.returnLink = page.getByTestId('return');
  }
}
