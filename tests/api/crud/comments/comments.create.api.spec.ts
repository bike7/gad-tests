import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify comments CREATE operations @GAD-R09-02 @crud @create @comments', () => {
  let articleId: number;
  let authorizationHeader: Headers;

  test.beforeAll('Login and create an article', async ({ request }) => {
    authorizationHeader = await getAuthorizationHeader(request);
    const articleData = prepareArticlePayload();
    const response = await createArticleViaApi(
      request,
      authorizationHeader,
      articleData,
    );
    const createdArticle = await response.json();
    articleId = createdArticle.id;
  });

  test('Should not create a comment without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatusCode = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const commentData = prepareCommentPayload(articleId);
    // Act
    const response = await request.post(apiEndpoints.comments, {
      data: commentData,
    });
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatusCode);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create a comment with a logged user', async ({ request }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const commentData = prepareCommentPayload(articleId);
    // Act
    const response = await createCommentViaApi(
      request,
      authorizationHeader,
      commentData,
    );
    const actualResponseStatus = response.status();
    const actualResponseBody = await response.json();
    // Assert
    expect.soft(actualResponseStatus).toBe(expectedResponseStatus);
    expect.soft(actualResponseBody.body).toBe(commentData.body);
  });

  test('Should create a new comment when modified comment id does not exist with a logged user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const endpoint = `${apiEndpoints.comments}/${new Date().valueOf()}`;
    const commentData = prepareCommentPayload(articleId);
    // Act
    const response = await request.put(endpoint, {
      headers: authorizationHeader,
      data: commentData,
    });
    const comment = await response.json();
    // Assert
    expect(response.status()).toBe(expectedResponseStatus);
    expect.soft(comment.body).toBe(commentData.body);
    expect.soft(comment.date).toBe(commentData.date);
  });
});
