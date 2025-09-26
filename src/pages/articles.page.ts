import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  expectedPageTitle = 'Articles';
  mainMenu: MainMenuComponent;
  addArticleButton: Locator;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.addArticleButton = this.page.getByRole('button', {
      name: 'Add Article',
    });
  }
  async goToArticle(title: string): Promise<void> {
    await this.page.getByText(title).click();
  }
}
