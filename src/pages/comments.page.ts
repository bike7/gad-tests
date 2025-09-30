import { BasePage } from './base.page';
import { MainMenuComponent } from '@_src/components/main-menu.component';
import { Page } from '@playwright/test';

export class CommentsPage extends BasePage {
  url = '/comments.html';
  expectedPageTitle = 'Comments';
  mainMenu: MainMenuComponent;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
  }
}
