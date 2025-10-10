import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { BasePage } from '@_src/ui/pages/base.page';
import { EditCommentView } from '@_src/ui/views/edit-comment.view';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu: MainMenuComponent;
  commentBody: Locator;
  private editButton: Locator;
  private returnLink: Locator;
  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.commentBody = page.getByTestId('comment-body');
    this.editButton = page.getByTestId('edit');
    this.returnLink = page.getByTestId('return');
  }
  async goToId(commentId: number): Promise<this> {
    await this.page.goto(`${this.url}?id=${commentId}`);
    await this.page.waitForLoadState('domcontentloaded');
    return this;
  }
  async clickEditButton(): Promise<EditCommentView> {
    await this.editButton.click();
    return new EditCommentView(this.page);
  }

  async clickReturnLink(): Promise<ArticlePage> {
    await this.returnLink.click();
    return new ArticlePage(this.page);
  }
}
