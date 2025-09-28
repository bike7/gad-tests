import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete comment', () => {
  let articleData: AddArticleModel;
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let articlePage: ArticlePage;
  let addArticleView: AddArticleView;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  test.beforeEach(async ({ page }) => {
    articleData = prepareRandomArticle();
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);
    addArticleView = new AddArticleView(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    await loginPage.goTo();
    await loginPage.loginAs(testUser);
    await articlesPage.goTo();
    await articlesPage.addArticleButton.click();
    await addArticleView.createArticle(articleData);
  });

  test('Create a new comment @GAD-R05-02', async ({}) => {
    // Arrange
    const comment = faker.lorem.sentence();
    const expectedAlertText = 'Comment was created';

    //Act
    await articlePage.addNewCommentButton.click();
    await expect(addCommentView.pageHeader).toContainText(
      addCommentView.expectedPageHeaderText,
    );
    await addCommentView.createComment(comment);
    //Assert
    await expect(addCommentView.alertPopup).toContainText(expectedAlertText);
    const articleComment = articlePage.getArticleComment(comment);
    await expect(articleComment.commentText).toHaveText(comment);
    await articleComment.link.click();
    await expect(commentPage.commentBody).toHaveText(comment);
  });
});
