import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test('Should return created comment from API @GAD-R07-05 @GAD-R07-06 @logged', async ({
  createRandomArticle,
  page,
}) => {
  // Arrange
  const commentData = prepareRandomComment();
  const expectedAlertText = 'Comment was created';
  const expectedResponseUrl = '/api/comments';
  const expectedResponseMethod = 'GET';
  const expectedResponseStatusCode = 200;
  //Act
  let articlePage = createRandomArticle;
  const addCommentView = await articlePage.clickAddNewCommentButton();
  const responsePromise = waitForResponse(
    page,
    expectedResponseUrl,
    expectedResponseMethod,
    expectedResponseStatusCode,
  );
  articlePage = await addCommentView.createComment(commentData.body);
  //Assert
  const response = await responsePromise;
  const responseBody = await response.json();
  await expect.soft(addCommentView.alertPopup).toContainText(expectedAlertText);
  expect.soft(responseBody[0].body).toBe(commentData.body); //TODO: sometimes response is not fully available when we validate it
});

test('Should not update comment with empty body @logged', async ({
  articlesRequestLogged,
  commentsRequestLogged,
  commentPage: page,
}) => {
  //Arrange
  const emptyBody = '';
  const expectedAlertText = 'Comment was not updated';
  const articleData = prepareArticlePayload();
  const articleResponse = await createArticleViaApi(
    articlesRequestLogged,
    articleData,
  );
  const createdArticle = await articleResponse.json();
  const commentData = prepareCommentPayload(createdArticle.id);
  const commentResponse = await createCommentViaApi(
    commentsRequestLogged,
    commentData,
  );
  const createdComment = await commentResponse.json();
  //Act
  let commentPage = await page.goToId(createdComment.id);
  const editCommentView = await commentPage.clickEditButton();
  await editCommentView.updateComment(emptyBody);
  //Assert
  await expect(editCommentView.alertPopup).toContainText(expectedAlertText);
  commentPage = await editCommentView.clickCancelButton();
  await expect(commentPage.commentBody).toContainText(commentData.body);
});
