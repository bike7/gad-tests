import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { BasePage } from '@_src/ui/pages/base.page';
import { CommentPage } from '@_src/ui/pages/comment.page';
import { AddCommentView } from '@_src/ui/views/add-comment.view';
import { Locator, Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/article.html';
  mainMenu: MainMenuComponent;
  articleTitle: Locator;
  articleBody: Locator;
  private deleteIcon: Locator;
  private addNewCommentButton: Locator;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.articleTitle = page.getByTestId('article-title');
    this.articleBody = page.getByTestId('article-body');
    this.deleteIcon = page.getByTestId('delete');
    this.addNewCommentButton = page.locator('#add-new');
  }
  async goToId(articleId: string): Promise<this> {
    await this.page.goto(`${this.url}?id=${articleId}`);
    await this.page.waitForLoadState('domcontentloaded');
    return this;
  }

  async deleteArticle(): Promise<ArticlesPage> {
    this.page.on('dialog', async (dialog) => await dialog.accept());
    await this.deleteIcon.click();
    return new ArticlesPage(this.page);
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
  async clickCommentLink(articleComment: ArticleComment): Promise<CommentPage> {
    await articleComment.link.click();
    return new CommentPage(this.page);
  }
  async clickAddNewCommentButton(): Promise<AddCommentView> {
    await this.addNewCommentButton.click();
    return new AddCommentView(this.page);
  }
}
interface ArticleComment {
  commentText: Locator;
  link: Locator;
}
