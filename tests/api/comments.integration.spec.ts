import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentPayload,
  Headers,
  apiEndpoints,
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments CRUD operations @crud', () => {
  let articleId: number;
  let authorizationHeader: Headers;
  test.beforeAll('Login and create an article', async ({ request }) => {
    authorizationHeader = await getAuthorizationHeader(request);
    const articlePayload = prepareArticlePayload();
    const responsePost = await request.post(apiEndpoints.articles, {
      headers: authorizationHeader,
      data: articlePayload,
    });
    const createdArticle = await responsePost.json();
    articleId = createdArticle.id;
    //Assert article exists
    await expect(async () => {
      const responseGet = await request.get(
        `${apiEndpoints.articles}/${articleId}`,
      );
      await expect(responseGet).toBeOK();
    }).toPass();
  });

  test('Should not create a comment without a logged-in user @GAD-R09-02', async ({
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

  test.describe('CRUD operations', () => {
    let commentData: CommentPayload;
    let commentResponse: APIResponse;
    let commentId: number;

    test.beforeEach('Should create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      commentResponse = await request.post(apiEndpoints.comments, {
        headers: authorizationHeader,
        data: commentData,
      });
      //Assert comment exists
      const commentJson = await commentResponse.json();
      commentId = commentJson.id;
      await expect(async () => {
        const responseGet = await request.get(
          `${apiEndpoints.comments}/${commentId}`,
        );
        await expect(responseGet).toBeOK();
      }).toPass();
    });

    test('Should create a comment with a logged user @GAD-R09-02', async ({}) => {
      // Arrange
      const expectedResponseStatusCode = 201;
      // Act
      const actualResponseStatus = commentResponse.status();
      const actualResponseBody = await commentResponse.json();
      // Assert
      expect(
        actualResponseStatus,
        `Expected status code: ${expectedResponseStatusCode}, but received: ${actualResponseStatus}`,
      ).toBe(expectedResponseStatusCode);
      expect.soft(actualResponseBody.body).toBe(commentData.body);
    });

    test('Should not delete a comment with a non-logged user @GAD-R09-04', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusCodeDelete = 401;
      const expectedResponseStatusCodeGet = 200;
      // Act
      const response = await request.delete(
        `${apiEndpoints.comments}/${commentId}`,
      );
      const responseStatusDelete = response.status();
      // Assert DELETE
      expect(
        responseStatusDelete,
        `Expected status code: ${expectedResponseStatusCodeDelete}, but received: ${responseStatusDelete}`,
      ).toBe(expectedResponseStatusCodeDelete);
      // Act (Get to check if the comment is deleted)
      const responseGet = await request.get(
        `${apiEndpoints.comments}/${commentId}`,
      );
      const responseStatusGet = responseGet.status();
      // Assert GET
      expect(
        responseStatusGet,
        `Expected status code: ${expectedResponseStatusCodeGet}, but received: ${responseStatusGet}`,
      ).toBe(expectedResponseStatusCodeGet);
    });

    test('Should delete a comment with a logged user @GAD-R09-04', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusCodeDelete = 200;
      const expectedResponseStatusCodeGet = 404;
      // Act
      const responseDelete = await request.delete(
        `${apiEndpoints.comments}/${commentId}`,
        { headers: authorizationHeader },
      );
      const responseStatusDelete = responseDelete.status();
      // Assert DELETE
      expect(
        responseStatusDelete,
        `Expected status code: ${expectedResponseStatusCodeDelete}, but received: ${responseStatusDelete}`,
      ).toBe(expectedResponseStatusCodeDelete);
      // Act (Get to check if the comment is deleted)
      const responseGet = await request.get(
        `${apiEndpoints.comments}/${commentId}`,
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
