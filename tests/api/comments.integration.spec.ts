import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expectGetResponseStatus } from '@_src/api/utils/assertions.api';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments CRUD operations @crud', () => {
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
    let endpoint: string;

    test.beforeEach('Should create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      commentResponse = await createCommentViaApi(
        request,
        authorizationHeader,
        commentData,
      );
      const commentJson = await commentResponse.json();
      endpoint = `${apiEndpoints.comments}/${commentJson.id}`;
    });

    test('Should create a comment with a logged user @GAD-R09-02', async ({}) => {
      // Arrange
      const expectedResponseStatus = 201;
      // Act
      const actualResponseStatus = commentResponse.status();
      const actualResponseBody = await commentResponse.json();
      // Assert
      expect(
        actualResponseStatus,
        `Expected status code: ${expectedResponseStatus}, but received: ${actualResponseStatus}`,
      ).toBe(expectedResponseStatus);
      expect.soft(actualResponseBody.body).toBe(commentData.body);
    });

    test('Should not delete a comment with a non-logged user @GAD-R09-04', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusDelete = 401;
      const expectedResponseStatusGet = 200;
      // Act
      const response = await request.delete(endpoint);
      const actualResponseStatusDelete = response.status();
      // Assert DELETE status
      expect(
        actualResponseStatusDelete,
        `Expected status code: ${expectedResponseStatusDelete}, but received: ${actualResponseStatusDelete}`,
      ).toBe(expectedResponseStatusDelete);
      // Assert Comment exists after unsuccessful deletion
      await expectGetResponseStatus(
        request,
        endpoint,
        expectedResponseStatusGet,
      );
    });

    test('Should delete a comment with a logged user @GAD-R09-04', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatusDelete = 200;
      const expectedResponseStatusGet = 404;
      // Act
      const responseDelete = await request.delete(endpoint, {
        headers: authorizationHeader,
      });
      const actualResponseStatusDelete = responseDelete.status();
      // Assert DELETE
      expect(
        actualResponseStatusDelete,
        `Expected status code: ${expectedResponseStatusDelete}, but received: ${actualResponseStatusDelete}`,
      ).toBe(expectedResponseStatusDelete);
      // Assert Comment does not exist anymore
      await expectGetResponseStatus(
        request,
        endpoint,
        expectedResponseStatusGet,
      );
    });
  });
});
