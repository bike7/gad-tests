import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify articles CREATE operations @GAD-R09-01 @crud @create @articles', () => {
  test('Should not create an article with a non-logged user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatus = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const articleData = prepareArticlePayload();
    // Act
    const response = await request.post(apiEndpoints.articles, {
      data: articleData,
    });
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatus);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create an article with a logged user', async ({ request }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const authorizationHeader = await getAuthorizationHeader(request);
    const articleData = prepareArticlePayload();
    // Act
    const articleResponse = await createArticleViaApi(
      request,
      authorizationHeader,
      articleData,
    );
    const actualResponseStatus = articleResponse.status();
    const actualResponseBody = await articleResponse.json();
    // Assert
    expect.soft(actualResponseStatus).toBe(expectedResponseStatus);
    expect.soft(actualResponseBody.title).toBe(articleData.title);
    expect.soft(actualResponseBody.body).toBe(articleData.body);
  });
});
