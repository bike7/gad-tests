import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify comments CREATE operations @GAD-R09-02 @crud @create @comments', () => {
  let articleId: number;

  test.beforeAll(
    'Login and create an article',
    async ({ articlesRequestLogged }) => {
      const articleData = prepareArticlePayload();
      const response = await createArticleViaApi(
        articlesRequestLogged,
        articleData,
      );
      const createdArticle = await response.json();
      articleId = createdArticle.id;
    },
  );

  test('Should not create a comment with a non-logged user', async ({
    commentsRequest,
  }) => {
    // Arrange
    const expectedResponseStatusCode = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const commentData = prepareCommentPayload(articleId);
    // Act
    const response = await commentsRequest.post(commentData);
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatusCode);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create a comment with a logged user', async ({
    commentsRequestLogged,
  }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const commentData = prepareCommentPayload(articleId);
    // Act
    const response = await createCommentViaApi(
      commentsRequestLogged,
      commentData,
    );
    const actualResponseStatus = response.status();
    const actualResponseBody = await response.json();
    // Assert
    expect.soft(actualResponseStatus).toBe(expectedResponseStatus);
    expect.soft(actualResponseBody.body).toBe(commentData.body);
  });

  test('Should create a new comment when modified comment id does not exist with a logged user', async ({
    commentsRequestLogged,
  }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const nonExistentCommentId = timestamp();
    const commentData = prepareCommentPayload(articleId);
    // Act
    const response = await commentsRequestLogged.put(
      nonExistentCommentId,
      commentData,
    );
    const comment = await response.json();
    // Assert
    expect(response.status()).toBe(expectedResponseStatus);
    expect.soft(comment.body).toBe(commentData.body);
    expect.soft(comment.date).toBe(commentData.date);
  });
});
