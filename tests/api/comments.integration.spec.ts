import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiEndpoints,
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';

test.describe('Verify comments CRUD operations @GAD-R09-02 @crud', () => {
  let createdArticleId: number;
  let authorizationHeader: {
    [key: string]: string;
  };
  test.beforeAll(async ({ request }) => {
    const articlesEndpoint = '/api/articles';
    authorizationHeader = await getAuthorizationHeader(request);
    const articlePayload = prepareArticlePayload();
    const response = await request.post(articlesEndpoint, {
      headers: authorizationHeader,
      data: articlePayload,
    });
    const createdArticle = await response.json();
    createdArticleId = createdArticle.id;
  });

  test('Should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatusCode = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const commentData = prepareCommentPayload(createdArticleId);
    // Act
    const response = await request.post(apiEndpoints.comments, {
      data: commentData,
    });
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatusCode);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create an article with a logged user', async ({ request }) => {
    // Arrange
    const expectedResponseStatusCode = 201;
    const commentData = prepareCommentPayload(createdArticleId);
    // Act
    const response = await request.post(apiEndpoints.comments, {
      headers: authorizationHeader,
      data: commentData,
    });
    const actualResponseStatus = response.status();
    const actualResponseBody = await response.json();
    // Assert
    expect(
      actualResponseStatus,
      `Expected status code: ${expectedResponseStatusCode}, but received: ${actualResponseStatus}`,
    ).toBe(expectedResponseStatusCode);
    expect.soft(actualResponseBody.body).toBe(commentData.body);
  });
});
