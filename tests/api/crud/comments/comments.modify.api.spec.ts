import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments UPDATE operations @GAD-R10-02 @crud @update @comments', () => {
  let articleId: number;
  let authorizationHeader: Headers;
  let createdCommentResponse: APIResponse;

  test.beforeAll(
    'Should login and create an article',
    async ({ request, articlesRequestLogged }) => {
      authorizationHeader = await getAuthorizationHeader(request);
      const articleData = prepareArticlePayload();
      const response = await createArticleViaApi(
        articlesRequestLogged,
        articleData,
      );
      const createdArticle = await response.json();
      articleId = createdArticle.id;
    },
  );

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
      commentsRequestLogged,
    }) => {
      // Arrange
      const expectedResponseStatus = 200;
      const createdComment = await createdCommentResponse.json();
      const modifiedCommentData = prepareCommentPayload(articleId);
      // Act
      const response = await commentsRequestLogged.put(
        createdComment.id,
        modifiedCommentData,
      );
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
      commentsRequest,
    }) => {
      // Arrange
      const expectedResponseStatus = 401;
      const expectedErrorMessage = 'Access token not provided!';
      const createdComment = await createdCommentResponse.json();
      const modifiedCommentData = prepareCommentPayload(articleId);
      // Act
      const response = await commentsRequest.put(
        createdComment.id,
        modifiedCommentData,
      );
      const responseBody = await response.json();
      const nonModifiedCommentResponse = await commentsRequest.get(
        createdComment.id,
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
      commentsRequestLogged,
    }) => {
      // Arrange
      const expectedResponseStatus = 200;
      const createdComment = await createdCommentResponse.json();
      const modifiedCommentData = {
        body: `Patched Body no. ${timestamp()}`,
      };
      // Act
      const response = await commentsRequestLogged.patch(
        createdComment.id,
        modifiedCommentData,
      );
      const modifiedComment = await response.json();
      // Assert
      expect(response.status()).toBe(expectedResponseStatus);
      expect.soft(modifiedComment.id).toBe(createdComment.id);
      expect.soft(modifiedComment.body).toBe(modifiedCommentData.body);
      expect.soft(modifiedComment.body).not.toBe(createdComment.body);
      expect.soft(modifiedComment.date).toBe(createdComment.date);
    });

    test('Should not partially modify a comment with a non-logged user', async ({
      commentsRequest,
    }) => {
      // Arrange
      const expectedResponseStatus = 401;
      const expectedErrorMessage = 'Access token not provided!';
      const createdComment = await createdCommentResponse.json();
      const modifiedCommentData = {
        body: `Patched Body no. ${timestamp()}`,
      };
      // Act
      const response = await commentsRequest.patch(
        createdComment.id,
        modifiedCommentData,
      );
      const responseBody = await response.json();
      const nonModifiedCommentResponse = await commentsRequest.get(
        createdComment.id,
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
      commentsRequestLogged,
    }) => {
      // Arrange
      const createdComment = await createdCommentResponse.json();
      const nonExistingField = 'nonExistingField';
      const modifiedCommentData: { [key: string]: string } = {};
      modifiedCommentData[nonExistingField] = 'non existing value';
      const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,article_id,body,date]`;
      const expectedResponseStatus = 422;
      // Act
      const response = await commentsRequestLogged.patch(
        createdComment.id,
        modifiedCommentData,
      );
      const responseBody = await response.json();
      const nonModifiedCommentResponse = await commentsRequestLogged.get(
        createdComment.id,
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
