import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete comment', () => {
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  test.beforeEach(async ({ page }) => {
    articleData = prepareRandomArticle();
    const articlesPage = await new ArticlesPage(page).goTo();
    const addArticleView = await articlesPage.clickAddArticleButton();
    articlePage = await addArticleView.createArticle(articleData);
  });

  test('Verify comments @GAD-R05-01 @GAD-R05-02 @logged', async ({}) => {
    // Arrange
    const commentData = prepareRandomComment();
    const updatedCommentData = prepareRandomComment();
    const expectedAlertTextForCommentCreate = 'Comment was created';
    const expectedAlertTextForCommentUpdate = 'Comment was updated';

    await test.step('Create a new comment', async ({}) => {
      //Act
      const addCommentView = await articlePage.clickAddNewCommentButton();
      await expect(addCommentView.pageHeader).toContainText(
        addCommentView.expectedPageHeaderText,
      );
      articlePage = await addCommentView.createComment(commentData.body);
      //Assert
      await expect(addCommentView.alertPopup).toContainText(
        expectedAlertTextForCommentCreate,
      );
    });

    let commentPage = await test.step('Verify created comment', async ({}) => {
      //Assert
      const articleComment = articlePage.getArticleComment(commentData.body);
      await expect(articleComment.commentText).toHaveText(commentData.body);
      const commentPage = await articlePage.clickCommentLink(articleComment);
      await expect(commentPage.commentBody).toHaveText(commentData.body);
      return commentPage;
    });

    await test.step('Update comment', async ({}) => {
      //Act
      const editCommentView = await commentPage.clickEditButton();
      commentPage = await editCommentView.updateComment(
        updatedCommentData.body,
      );
      //Assert
      await expect(editCommentView.alertPopup).toContainText(
        expectedAlertTextForCommentUpdate,
      );
      await expect(commentPage.commentBody).toContainText(
        updatedCommentData.body,
      );
    });

    await test.step('Verify updated comment on article page', async ({}) => {
      //Act
      articlePage = await commentPage.clickReturnLink();
      //Assert
      const updatedArticleComment = articlePage.getArticleComment(
        updatedCommentData.body,
      );
      await expect(updatedArticleComment.commentText).toHaveText(
        updatedCommentData.body,
      );
    });
  });
  test('User can add more than one comment to article @GAD-R05-03 @logged', async ({}) => {
    // Arrange
    const expectedAlertText = 'Comment was created';

    await test.step('Create the first comment', async ({}) => {
      //Arrange
      const commentData = prepareRandomComment();
      //Act
      const addCommentView = await articlePage.clickAddNewCommentButton();
      articlePage = await addCommentView.createComment(commentData.body);
      //Assert
      await expect(addCommentView.alertPopup).toContainText(expectedAlertText);
    });

    await test.step('Create and verify the second comment', async ({}) => {
      //Arrange
      const anotherCommentData = prepareRandomComment();
      //Act
      const addCommentView = await articlePage.clickAddNewCommentButton();
      await expect(addCommentView.pageHeader).toContainText(
        addCommentView.expectedPageHeaderText,
      );
      articlePage = await addCommentView.createComment(anotherCommentData.body);
      //Assert
      await expect(addCommentView.alertPopup).toContainText(expectedAlertText);
      const articleComment = articlePage.getArticleComment(
        anotherCommentData.body,
      );
      await expect(articleComment.commentText).toHaveText(
        anotherCommentData.body,
      );
      const commentPage = await articlePage.clickCommentLink(articleComment);
      await expect(commentPage.commentBody).toHaveText(anotherCommentData.body);
    });
  });
});
