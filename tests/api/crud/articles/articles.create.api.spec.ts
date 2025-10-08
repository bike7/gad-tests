import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify articles CREATE operations @GAD-R09-01 @crud @create @articles', () => {
  test('Should not create an article with a non-logged user', async ({
    articlesRequest,
  }) => {
    // Arrange
    const expectedResponseStatus = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const articleData = prepareArticlePayload();
    // Act
    const response = await articlesRequest.post(articleData);
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatus);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create an article with a logged user', async ({
    articlesRequestLogged,
  }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const articleData = prepareArticlePayload();
    // Act
    const articleResponse = await createArticleViaApi(
      articlesRequestLogged,
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
    articlesRequestLogged,
  }) => {
    // Arrange
    const expectedResponseStatus = 201;
    const nonExistentArticleId = timestamp();
    const articleData = prepareArticlePayload();
    // Act
    const response = await articlesRequestLogged.put(
      nonExistentArticleId,
      articleData,
    );
    const article = await response.json();
    // Assert
    expect(response.status()).toBe(expectedResponseStatus);
    expect.soft(article.title).toBe(articleData.title);
    expect.soft(article.body).toBe(articleData.body);
    expect.soft(article.date).toBe(articleData.date);
    expect.soft(article.image).toBe(articleData.image);
  });
});
