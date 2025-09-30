import { MainMenuComponent } from '@_src/components/main-menu.component';
import { BasePage } from '@_src/pages/base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  expectedPageTitle = 'Articles';
  mainMenu: MainMenuComponent;
  addArticleButton: Locator;
  searchInput: Locator;
  goSearchButton: Locator;
  noResultsText: Locator;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.addArticleButton = this.page.getByRole('button', {
      name: 'Add Article',
    });
    this.searchInput = this.page.getByTestId('search-input');
    this.goSearchButton = this.page.getByTestId('search-button');
    this.noResultsText = this.page.getByTestId('no-results');
  }
  async goToArticle(title: string): Promise<void> {
    await this.page.getByText(title).click();
  }

  async searchForArticle(searchPhrase: string): Promise<void> {
    await this.searchInput.fill(searchPhrase);
    await this.goSearchButton.click();
  }
}
