import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import {
  expectGetResponseStatus,
  expectStatusToBe,
} from '@_src/api/utils/assertions.api';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify articles CRUD operations @crud', () => {
  test('Should not create an article with a non-logged user @GAD-R09-01', async ({
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

  test.describe('CRUD operations', () => {
    let authorizationHeader: Headers;
    let articleData: ArticlePayload;
    let articleResponse: APIResponse;
    let endpoint: string;

    test.beforeAll('Should login', async ({ request }) => {
      authorizationHeader = await getAuthorizationHeader(request);
    });

    test.beforeEach('Should create an article', async ({ request }) => {
      articleData = prepareArticlePayload();
      articleResponse = await createArticleViaApi(
        request,
        authorizationHeader,
        articleData,
      );
      const articleJson = await articleResponse.json();
      endpoint = `${apiEndpoints.articles}/${articleJson.id}`;
    });

    test('Should create an article with a logged user GAD-R09-01', async ({}) => {
      // Arrange
      const expectedResponseStatus = 201;
      // Act
      const actualResponseStatus = articleResponse.status();
      const actualResponseBody = await articleResponse.json();
      // Assert
      expectStatusToBe(actualResponseStatus, expectedResponseStatus);
      expect.soft(actualResponseBody.title).toBe(articleData.title);
      expect.soft(actualResponseBody.body).toBe(articleData.body);
    });

    // eslint-disable-next-line
    test('Should not delete an article with a non-logged user @GAD-R09-03', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusDelete = 401;
      const expectedResponseStatusAfterGet = 200;
      // Act
      const response = await request.delete(endpoint);
      const actualResponseStatusDelete = response.status();
      // Assert DELETE status
      expectStatusToBe(
        actualResponseStatusDelete,
        expectedResponseStatusDelete,
      );
      // Assert Article exists after unsuccessful deletion
      await expectGetResponseStatus(
        request,
        endpoint,
        expectedResponseStatusAfterGet,
      );
    });

    test('Should delete an article with a logged user @GAD-R09-03', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusCodeDelete = 200;
      const expectedResponseStatusCodeGet = 404;
      // Act
      const responseDelete = await request.delete(endpoint, {
        headers: authorizationHeader,
      });
      const responseStatusDelete = responseDelete.status();
      // Assert DELETE status
      expect(
        responseStatusDelete,
        `Expected status code: ${expectedResponseStatusCodeDelete}, but received: ${responseStatusDelete}`,
      ).toBe(expectedResponseStatusCodeDelete);
      // Assert Article does not exist anymore
      await expectGetResponseStatus(
        request,
        endpoint,
        expectedResponseStatusCodeGet,
      );
    });
  });
});
