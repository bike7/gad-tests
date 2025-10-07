import {
  ArticlePayload,
  prepareArticlePayload,
} from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
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
    let headers: Headers;
    let articleData: ArticlePayload;
    let articleResponse: APIResponse;

    test.beforeAll('Should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request);
    });

    test.beforeEach('Should create an article', async ({ request }) => {
      articleData = prepareArticlePayload();
      articleResponse = await request.post(apiEndpoints.articles, {
        headers,
        data: articleData,
      });
      // Assert article exist
      const articleResponseBody = await articleResponse.json();
      await expect(async () => {
        const response = await request.get(
          `${apiEndpoints.articles}/${articleResponseBody.id}`,
        );
        await expect(response).toBeOK();
      }).toPass();
    });

    test('Should create an article with a logged user GAD-R09-01', async ({}) => {
      // Arrange
      const expectedResponseStatusCode = 201;
      // Act
      const actualResponseStatus = articleResponse.status();
      const actualResponseBody = await articleResponse.json();
      // Assert
      expect(
        actualResponseStatus,
        `Expected status code: ${expectedResponseStatusCode}, but received: ${actualResponseStatus}`,
      ).toBe(expectedResponseStatusCode);
      expect.soft(actualResponseBody.title).toBe(articleData.title);
      expect.soft(actualResponseBody.body).toBe(articleData.body);
    });

    test('Should not delete an article with a non-logged user @GAD-R09-03', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusCodeDelete = 401;
      const expectedResponseStatusCodeGet = 200;
      // Act
      const body = await articleResponse.json();
      const response = await request.delete(
        `${apiEndpoints.articles}/${body.id}`,
      );
      const responseStatusDelete = response.status();
      // Assert DELETE
      expect(
        responseStatusDelete,
        `Expected status code: ${expectedResponseStatusCodeDelete}, but received: ${responseStatusDelete}`,
      ).toBe(expectedResponseStatusCodeDelete);
      // Act (Get to check if the article is deleted)
      const responseGet = await request.get(
        `${apiEndpoints.articles}/${body.id}`,
      );
      const responseStatusGet = responseGet.status();
      // Assert GET
      expect(
        responseStatusGet,
        `Expected status code: ${expectedResponseStatusCodeGet}, but received: ${responseStatusGet}`,
      ).toBe(expectedResponseStatusCodeGet);
    });

    test('Should delete an article with a logged user @GAD-R09-03', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusCodeDelete = 200;
      const expectedResponseStatusCodeGet = 404;
      // Act
      const body = await articleResponse.json();
      const responseDelete = await request.delete(
        `${apiEndpoints.articles}/${body.id}`,
        {
          headers,
        },
      );
      const responseStatusDelete = responseDelete.status();
      // Assert DELETE
      expect(
        responseStatusDelete,
        `Expected status code: ${expectedResponseStatusCodeDelete}, but received: ${responseStatusDelete}`,
      ).toBe(expectedResponseStatusCodeDelete);
      // Act (Get to check if the article is deleted)
      const responseGet = await request.get(
        `${apiEndpoints.articles}/${body.id}`,
      );
      const responseStatusGet = responseGet.status();
      // Assert GET
      expect(
        responseStatusGet,
        `Expected status code: ${expectedResponseStatusCodeGet}, but received: ${responseStatusGet}`,
      ).toBe(expectedResponseStatusCodeGet);
    });
  });
});
