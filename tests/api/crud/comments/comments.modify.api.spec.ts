import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments UPDATE operations @GAD-R10-02 @crud @update @comments', () => {
  let articleId: number;
  let authorizationHeader: Headers;
  let createdCommentResponse: APIResponse;

  test.beforeAll('Should login and create an article', async ({ request }) => {
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

  test.beforeEach('Should create a comment', async ({ request }) => {
    const commentData = prepareCommentPayload(articleId);
    createdCommentResponse = await createCommentViaApi(
      request,
      authorizationHeader,
      commentData,
    );
  });

  test.describe('Fully modify comments @GAD-R10-02', () => {
    test('Should fully modify a comment with a logged user', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatus = 200;
      const createdComment = await createdCommentResponse.json();
      const createdCommentsEndpoint = `${apiEndpoints.comments}/${createdComment.id}`;
      const modifiedCommentData = prepareCommentPayload(articleId);
      // Act
      const response = await request.put(createdCommentsEndpoint, {
        headers: authorizationHeader,
        data: modifiedCommentData,
      });
      const modifiedComment = await response.json();
      // Assert
      expect(response.status()).toBe(expectedResponseStatus);
      expect.soft(modifiedComment.id).toBe(createdComment.id);
      expect.soft(modifiedComment.body).toBe(modifiedCommentData.body);
      expect.soft(modifiedComment.body).not.toBe(createdComment.body);
      expect.soft(modifiedComment.date).toBe(modifiedCommentData.date);
      expect.soft(modifiedComment.date).not.toBe(createdComment.date);
    });

    test('Should not fully modify a comment with a non-logged user', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatus = 401;
      const expectedErrorMessage = 'Access token not provided!';
      const createdComment = await createdCommentResponse.json();
      const createdCommentEndpoint = `${apiEndpoints.comments}/${createdComment.id}`;
      const modifiedCommentData = prepareArticlePayload();
      // Act
      const response = await request.put(createdCommentEndpoint, {
        data: modifiedCommentData,
      });
      const responseBody = await response.json();
      const nonModifiedCommentResponse = await request.get(
        createdCommentEndpoint,
      );
      const nonModifiedComment = await nonModifiedCommentResponse.json();
      // Assert
      expect.soft(response.status()).toBe(expectedResponseStatus);
      expect.soft(responseBody.error.message).toBe(expectedErrorMessage);
      expect.soft(nonModifiedComment.id).toBe(createdComment.id);
      expect.soft(nonModifiedComment.body).toBe(createdComment.body);
      expect.soft(nonModifiedComment.date).toBe(createdComment.date);
    });
  });

  test.describe('Partially modify comments @GAD-R10-02', () => {
    test('Should partially modify a comment with a logged user', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatus = 200;
      const createdComment = await createdCommentResponse.json();
      const createdCommentsEndpoint = `${apiEndpoints.comments}/${createdComment.id}`;
      const modifiedCommentData = {
        body: `Patched Body no. ${new Date().getDate().valueOf()}`,
      };
      // Act
      const response = await request.patch(createdCommentsEndpoint, {
        headers: authorizationHeader,
        data: modifiedCommentData,
      });
      const modifiedComment = await response.json();
      // Assert
      expect(response.status()).toBe(expectedResponseStatus);
      expect.soft(modifiedComment.id).toBe(createdComment.id);
      expect.soft(modifiedComment.body).toBe(modifiedCommentData.body);
      expect.soft(modifiedComment.body).not.toBe(createdComment.body);
      expect.soft(modifiedComment.date).toBe(createdComment.date);
    });

    test('Should not partially modify a comment with a non-logged user', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatus = 401;
      const expectedErrorMessage = 'Access token not provided!';
      const createdComment = await createdCommentResponse.json();
      const createdCommentEndpoint = `${apiEndpoints.comments}/${createdComment.id}`;
      const modifiedCommentData = {
        body: `Patched Body no. ${new Date().getDate().valueOf()}`,
      };
      // Act
      const response = await request.patch(createdCommentEndpoint, {
        data: modifiedCommentData,
      });
      const responseBody = await response.json();
      const nonModifiedCommentResponse = await request.get(
        createdCommentEndpoint,
      );
      const nonModifiedComment = await nonModifiedCommentResponse.json();
      // Assert
      expect.soft(response.status()).toBe(expectedResponseStatus);
      expect.soft(responseBody.error.message).toBe(expectedErrorMessage);
      expect.soft(nonModifiedComment.id).toBe(createdComment.id);
      expect.soft(nonModifiedComment.body).toBe(createdComment.body);
      expect.soft(nonModifiedComment.date).toBe(createdComment.date);
    });

    test('Should not partially modify a comment with improper field and logged user', async ({
      request,
    }) => {
      // Arrange
      const expectedResponseStatus = 422;
      const createdComment = await createdCommentResponse.json();
      const createdCommentEndpoint = `${apiEndpoints.comments}/${createdComment.id}`;
      const nonExistingField = 'nonExistingField';
      const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,article_id,body,date]`;
      const modifiedCommentData = {
        [nonExistingField]: 'non existing value',
      };
      // Act
      const response = await request.patch(createdCommentEndpoint, {
        headers: authorizationHeader,
        data: modifiedCommentData,
      });
      const responseBody = await response.json();
      const nonModifiedCommentResponse = await request.get(
        createdCommentEndpoint,
      );
      const nonModifiedComment = await nonModifiedCommentResponse.json();
      // Assert
      expect.soft(response.status()).toBe(expectedResponseStatus);
      expect.soft(responseBody.error.message).toBe(expectedErrorMessage);
      expect.soft(nonModifiedComment.id).toBe(createdComment.id);
      expect.soft(nonModifiedComment.body).toBe(createdComment.body);
      expect.soft(nonModifiedComment.date).toBe(createdComment.date);
    });
  });
});
