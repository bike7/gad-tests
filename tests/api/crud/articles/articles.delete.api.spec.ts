import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expectGetResponseStatus } from '@_src/api/utils/assertions.api';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify articles DELETE operations @GAD-R09-03 @crud @delete @articles', () => {
  let authorizationHeader: Headers;
  let endpoint: string;

  test.beforeAll('Should login', async ({ request }) => {
    authorizationHeader = await getAuthorizationHeader(request);
  });

  test.beforeEach('Should create an article', async ({ request }) => {
    const articleData = prepareArticlePayload();
    const articleResponse = await createArticleViaApi(
      request,
      authorizationHeader,
      articleData,
    );
    const articleJson = await articleResponse.json();
    endpoint = `${apiEndpoints.articles}/${articleJson.id}`;
  });

  test('Should not delete an article with a non-logged user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatusDelete = 401;
    const expectedResponseStatusAfterGet = 200;
    // Act
    const response = await request.delete(endpoint);
    const actualResponseStatusDelete = response.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Article exists after unsuccessful deletion
    await expectGetResponseStatus(
      request,
      endpoint,
      expectedResponseStatusAfterGet,
    );
  });

  test('Should delete an article with a logged user', async ({ request }) => {
    // Arrange
    const expectedResponseStatusDelete = 200;
    const expectedResponseStatusCodeGet = 404;
    // Act
    const response = await request.delete(endpoint, {
      headers: authorizationHeader,
    });
    const actualResponseStatusDelete = response.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Article does not exist anymore
    await expectGetResponseStatus(
      request,
      endpoint,
      expectedResponseStatusCodeGet,
    );
  });
});
