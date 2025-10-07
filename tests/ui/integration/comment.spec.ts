import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
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
  expect.soft(responseBody[0].body).toBe(commentData.body);
});
