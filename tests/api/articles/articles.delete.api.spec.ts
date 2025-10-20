import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { expectGetResponseStatus } from '@_src/api/utils/assertions.api';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify articles DELETE operations @GAD-R09-03 @crud @delete @articles', () => {
  let createdArticleId: number;

  test.beforeEach(
    'Should create an article',
    async ({ articlesRequestLogged }) => {
      const articleData = prepareArticlePayload();
      const articleResponse = await createArticleViaApi(
        articlesRequestLogged,
        articleData,
      );
      const articleJson = await articleResponse.json();
      createdArticleId = articleJson.id;
    },
  );

  test('Should not delete an article with a non-logged user', async ({
    articlesRequest,
  }) => {
    // Arrange
    const expectedResponseStatusDelete = 401;
    const expectedResponseStatusAfterGet = 200;
    // Act
    const response = await articlesRequest.delete(createdArticleId);
    const actualResponseStatusDelete = response.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Article exists after unsuccessful deletion
    await expectGetResponseStatus(
      articlesRequest,
      createdArticleId,
      expectedResponseStatusAfterGet,
    );
  });

  test('Should delete an article with a logged user', async ({
    articlesRequestLogged,
  }) => {
    // Arrange
    const expectedResponseStatusDelete = 200;
    const expectedResponseStatusGet = 404;
    // Act
    const response = await articlesRequestLogged.delete(createdArticleId);
    const actualResponseStatusDelete = response.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Article does not exist anymore
    await expect(articlesRequestLogged).getToReturnStatus(
      createdArticleId,
      expectedResponseStatusGet,
    );
  });
});
