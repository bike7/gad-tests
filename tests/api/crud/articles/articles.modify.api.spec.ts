import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify articles UPDATE operations @crud @update @articles', () => {
  let createdArticleResponse: APIResponse;

  test.beforeEach(
    'Should create an article',
    async ({ articlesRequestLogged }) => {
      const articleData = prepareArticlePayload();
      createdArticleResponse = await createArticleViaApi(
        articlesRequestLogged,
        articleData,
      );
    },
  );

  test.describe('Fully modify articles @GAD-R10-01', () => {
    test('Should fully modify an article with a logged user', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedResponseStatus = 200;
      const createdArticle = await createdArticleResponse.json();
      const modifiedArticleData = prepareArticlePayload();
      const image =
        '.\\data\\images\\256\\rory-mckeever-w0kMi0osklU-unsplash.jpg';
      modifiedArticleData.image = image;
      // Act
      const response = await articlesRequestLogged.put(
        createdArticle.id,
        modifiedArticleData,
      );
      const modifiedArticle = await response.json();
      // Assert
      expect(response.status()).toBe(expectedResponseStatus);
      expect.soft(modifiedArticle.id).toBe(createdArticle.id);
      expect.soft(modifiedArticle.title).toBe(modifiedArticleData.title);
      expect.soft(modifiedArticle.title).not.toBe(createdArticle.title);
      expect.soft(modifiedArticle.body).toBe(modifiedArticleData.body);
      expect.soft(modifiedArticle.body).not.toBe(createdArticle.body);
      expect.soft(modifiedArticle.date).toBe(modifiedArticleData.date);
      expect.soft(modifiedArticle.date).not.toBe(createdArticle.date);
      expect.soft(modifiedArticle.image).toBe(modifiedArticleData.image);
      expect.soft(modifiedArticle.image).not.toBe(createdArticle.image);
    });

    test('Should not fully modify an article with a non-logged user', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedResponseStatus = 401;
      const expectedErrorMessage = 'Access token not provided!';
      const createdArticle = await createdArticleResponse.json();
      const modifiedArticleData = prepareArticlePayload();
      const image =
        '.\\data\\images\\256\\rory-mckeever-w0kMi0osklU-unsplash.jpg';
      modifiedArticleData.image = image;
      // Act
      const response = await articlesRequest.put(
        createdArticle.id,
        modifiedArticleData,
      );
      const responseBody = await response.json();
      const nonModifiedArticleResponse = await articlesRequest.get(
        createdArticle.id,
      );
      const nonModifiedArticle = await nonModifiedArticleResponse.json();
      // Assert
      expect.soft(response.status()).toBe(expectedResponseStatus);
      expect.soft(responseBody.error.message).toBe(expectedErrorMessage);
      expect.soft(nonModifiedArticle.id).toBe(createdArticle.id);
      expect.soft(nonModifiedArticle.title).toBe(createdArticle.title);
      expect.soft(nonModifiedArticle.body).toBe(createdArticle.body);
      expect.soft(nonModifiedArticle.date).toBe(createdArticle.date);
      expect.soft(nonModifiedArticle.image).toBe(createdArticle.image);
    });
  });

  test.describe('Partially modify articles @GAD-R10-03', () => {
    test('Should partially modify an article with a logged user', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedResponseStatus = 200;
      const createdArticle = await createdArticleResponse.json();
      const modifiedArticleData = {
        title: `Patched Title no. ${timestamp()}`,
      };
      // Act
      const response = await articlesRequestLogged.patch(
        createdArticle.id,
        modifiedArticleData,
      );
      const modifiedArticle = await response.json();
      // Assert
      expect(response.status()).toBe(expectedResponseStatus);
      expect.soft(modifiedArticle.id).toBe(createdArticle.id);
      expect.soft(modifiedArticle.title).toBe(modifiedArticleData.title);
      expect.soft(modifiedArticle.title).not.toBe(createdArticle.title);
      expect.soft(modifiedArticle.body).toBe(createdArticle.body);
      expect.soft(modifiedArticle.date).toBe(createdArticle.date);
      expect.soft(modifiedArticle.image).toBe(createdArticle.image);
    });

    test('Should not partially modify an article with a non-logged user', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedResponseStatus = 401;
      const expectedErrorMessage = 'Access token not provided!';
      const createdArticle = await createdArticleResponse.json();
      const modifiedArticleData = {
        title: `Patched Title no. ${timestamp()}`,
      };
      // Act
      const response = await articlesRequest.patch(
        createdArticle.id,
        modifiedArticleData,
      );
      const responseBody = await response.json();
      const nonModifiedArticleResponse = await articlesRequest.get(
        createdArticle.id,
      );
      const nonModifiedArticle = await nonModifiedArticleResponse.json();
      // Assert
      expect.soft(response.status()).toBe(expectedResponseStatus);
      expect.soft(responseBody.error.message).toBe(expectedErrorMessage);
      expect.soft(nonModifiedArticle.id).toBe(createdArticle.id);
      expect.soft(nonModifiedArticle.title).toBe(createdArticle.title);
      expect.soft(nonModifiedArticle.body).toBe(createdArticle.body);
      expect.soft(nonModifiedArticle.date).toBe(createdArticle.date);
      expect.soft(nonModifiedArticle.image).toBe(createdArticle.image);
    });

    test('Should not partially modify an article with improper field and logged user', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const nonExistingField = 'nonExistingField';
      const modifiedArticleData: { [key: string]: string } = {};
      modifiedArticleData[nonExistingField] = 'non existing value';
      const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,title,body,date,image]`;
      const expectedResponseStatus = 422;

      const createdArticle = await createdArticleResponse.json();
      // Act
      const response = await articlesRequestLogged.patch(
        createdArticle.id,
        modifiedArticleData,
      );
      const responseBody = await response.json();
      const nonModifiedArticleResponse = await articlesRequestLogged.get(
        createdArticle.id,
      );
      const nonModifiedArticle = await nonModifiedArticleResponse.json();
      // Assert
      expect.soft(response.status()).toBe(expectedResponseStatus);
      expect.soft(responseBody.error.message).toBe(expectedErrorMessage);
      expect.soft(nonModifiedArticle.id).toBe(createdArticle.id);
      expect.soft(nonModifiedArticle.title).toBe(createdArticle.title);
      expect.soft(nonModifiedArticle.body).toBe(createdArticle.body);
      expect.soft(nonModifiedArticle.date).toBe(createdArticle.date);
      expect.soft(nonModifiedArticle.image).toBe(createdArticle.image);
    });
  });
});
