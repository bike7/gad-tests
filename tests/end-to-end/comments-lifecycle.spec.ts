import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentPage } from '@_src/pages/comment.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { AddCommentView } from '@_src/views/add-comment.view';
import { EditCommentView } from '@_src/views/edit-comment.view';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete comment', () => {
  let articleData: AddArticleModel;
  let articlesPage: ArticlesPage;
  let articlePage: ArticlePage;
  let addArticleView: AddArticleView;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;
  test.beforeEach(async ({ page }) => {
    articleData = prepareRandomArticle();
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);
    addArticleView = new AddArticleView(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);
    await articlesPage.goTo();
    await articlesPage.addArticleButton.click();
    await addArticleView.createArticle(articleData);
  });

  test('Verify comments @GAD-R05-01 @GAD-R05-02 @logged', async ({}) => {
    // Arrange
    const commentData = prepareRandomComment();
    const updatedCommentData = prepareRandomComment();
    const expectedAlertTextForCommentCreate = 'Comment was created';
    const expectedAlertTextForCommentUpdate = 'Comment was updated';

    await test.step('Create a new comment', async ({}) => {
      //Act
      await articlePage.addNewCommentButton.click();
      await expect(addCommentView.pageHeader).toContainText(
        addCommentView.expectedPageHeaderText,
      );
      await addCommentView.createComment(commentData.body);
      //Assert
      await expect(addCommentView.alertPopup).toContainText(
        expectedAlertTextForCommentCreate,
      );
    });

    await test.step('Verify created comment', async ({}) => {
      //Assert
      const articleComment = articlePage.getArticleComment(commentData.body);
      await expect(articleComment.commentText).toHaveText(commentData.body);
      await articleComment.link.click();
      await expect(commentPage.commentBody).toHaveText(commentData.body);
    });

    await test.step('Update comment', async ({}) => {
      //Act
      await commentPage.editButton.click();
      await editCommentView.updateComment(updatedCommentData.body);
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
      await commentPage.returnLink.click();
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
      await articlePage.addNewCommentButton.click();
      await addCommentView.createComment(commentData.body);
      //Assert
      await expect(addCommentView.alertPopup).toContainText(expectedAlertText);
    });

    await test.step('Create and verify the second comment', async ({}) => {
      const anotherCommentBody =
        await test.step('Create the second comment', async ({}) => {
          //Arrange
          const anotherCommentData = prepareRandomComment();
          //Act
          await articlePage.addNewCommentButton.click();
          await expect(addCommentView.pageHeader).toContainText(
            addCommentView.expectedPageHeaderText,
          );
          await addCommentView.createComment(anotherCommentData.body);
          return anotherCommentData.body;
        });

      await test.step('Verify the second comment', async ({}) => {
        //Assert
        await expect(addCommentView.alertPopup).toContainText(
          expectedAlertText,
        );
        const articleComment =
          articlePage.getArticleComment(anotherCommentBody);
        await expect(articleComment.commentText).toHaveText(anotherCommentBody);
        await articleComment.link.click();
        await expect(commentPage.commentBody).toHaveText(anotherCommentBody);
      });
    });
  });
});
