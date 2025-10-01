import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlePage } from '@_src/pages/article.page';
import { BasePage } from '@_src/pages/base.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  expectedPageTitle = 'Articles';
  mainMenu: MainMenuComponent;
  private addArticleButton: Locator;
  private searchInput: Locator;
  private goSearchButton: Locator;
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
  async goToArticle(title: string): Promise<ArticlePage> {
    await this.page.getByText(title).click();
    return new ArticlePage(this.page);
  }

  async searchForArticle(searchPhrase: string): Promise<this> {
    await this.searchInput.fill(searchPhrase);
    await this.goSearchButton.click();
    return this;
  }

  async clickAddArticleButton(): Promise<AddArticleView> {
    await this.addArticleButton.click();
    return new AddArticleView(this.page);
  }
}
