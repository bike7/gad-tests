import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/article.html';
  mainMenu: MainMenuComponent;
  articleTitle: Locator;
  articleBody: Locator;
  deleteIcon: Locator;
  addNewCommentButton: Locator;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.articleTitle = page.getByTestId('article-title');
    this.articleBody = page.getByTestId('article-body');
    this.deleteIcon = page.getByTestId('delete');
    this.addNewCommentButton = page.locator('#add-new');
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => await dialog.accept());
    await this.deleteIcon.click();
  }

  getArticleComment(body: string): ArticleComment {
    const commentContainer = this.page
      .locator('.comment-container')
      .filter({ hasText: body });

    return {
      commentText: commentContainer.locator(':text("comment:") + span'),
      link: commentContainer.locator("[id^='gotoComment']"),
    };
  }
}
interface ArticleComment {
  commentText: Locator;
  link: Locator;
}
