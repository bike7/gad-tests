import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiEndpoints,
  getAuthorizationHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';

test.describe('Verify articles CRUD operations @GAD-R09-01 @crud', () => {
  test('Should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatusCode = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const articleData = prepareArticlePayload();
    // Act
    const response = await request.post(apiEndpoints.articles, {
      data: articleData,
    });
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatusCode);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create an article with a logged user', async ({ request }) => {
    // Arrange
    const headers = await getAuthorizationHeader(request);
    const expectedResponseStatusCode = 201;
    const articleData = prepareArticlePayload();
    // Act
    const response = await request.post(apiEndpoints.articles, {
      headers,
      data: articleData,
    });
    const actualResponseStatus = response.status();
    const actualResponseBody = await response.json();
    // Assert
    expect(
      actualResponseStatus,
      `Expected status code: ${expectedResponseStatusCode}, but received: ${actualResponseStatus}`,
    ).toBe(expectedResponseStatusCode);
    expect.soft(actualResponseBody.title).toBe(articleData.title);
    expect.soft(actualResponseBody.body).toBe(articleData.body);
  });
});
