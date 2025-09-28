import { prepareRandomArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
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
  let editCommentView: EditCommentView;
  test.beforeEach(async ({ page }) => {
    articleData = prepareRandomArticle();
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);
    addArticleView = new AddArticleView(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);
    await loginPage.goTo();
    await loginPage.loginAs(testUser);
    await articlesPage.goTo();
    await articlesPage.addArticleButton.click();
    await addArticleView.createArticle(articleData);
  });

  test('Create a new comment @GAD-R05-02', async ({}) => {
    // Arrange
    const commentData = prepareRandomComment();
    const updatedCommentData = prepareRandomComment();
    const expectedAlertTextForCommentCreate = 'Comment was created';
    const expectedAlertTextForCommentUpdate = 'Comment was updated';
    //Act
    await articlePage.addNewCommentButton.click();
    await expect(addCommentView.pageHeader).toContainText(
      addCommentView.expectedPageHeaderText,
    );
    await addCommentView.createComment(commentData.body);
    //Assert comment creation
    await expect(addCommentView.alertPopup).toContainText(
      expectedAlertTextForCommentCreate,
    );
    const articleComment = articlePage.getArticleComment(commentData.body);
    await expect(articleComment.commentText).toHaveText(commentData.body);
    await articleComment.link.click();
    await expect(commentPage.commentBody).toHaveText(commentData.body);
    //Assert comment update
    await commentPage.editButton.click();
    await editCommentView.updateComment(updatedCommentData.body);
    await expect(editCommentView.alertPopup).toContainText(
      expectedAlertTextForCommentUpdate,
    );
    await expect(commentPage.commentBody).toContainText(
      updatedCommentData.body,
    );
    await commentPage.returnLink.click();
    const updatedArticleComment = articlePage.getArticleComment(
      updatedCommentData.body,
    );
    await expect(updatedArticleComment.commentText).toHaveText(
      updatedCommentData.body,
    );
  });
});
