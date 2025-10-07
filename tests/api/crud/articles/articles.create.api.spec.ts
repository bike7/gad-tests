import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify articles CREATE operations @GAD-R09-01 @crud @create @articles', () => {
  let authorizationHeader: Headers;
  test.beforeAll('Should login', async ({ request }) => {
    authorizationHeader = await getAuthorizationHeader(request);
  });

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

  test('Should create a new article when modified article id does not exist with a logged user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const endpoint = `${apiEndpoints.articles}/${new Date().valueOf()}`;
    const articleData = prepareArticlePayload();
    // Act
    const response = await request.put(endpoint, {
      headers: authorizationHeader,
      data: articleData,
    });
    const article = await response.json();
    // Assert
    expect(response.status()).toBe(expectedResponseStatus);
    expect.soft(article.title).toBe(articleData.title);
    expect.soft(article.body).toBe(articleData.body);
    expect.soft(article.date).toBe(articleData.date);
    expect.soft(article.image).toBe(articleData.image);
  });
});
