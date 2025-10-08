import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { expectGetResponseStatus } from '@_src/api/utils/assertions.api';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify comments DELETE operations @GAD-R09-04 @crud @delete @comments', () => {
  let articleId: number;
  let authorizationHeader: Headers;
  let endpoint: string;

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
    const commentResponse = await createCommentViaApi(
      request,
      authorizationHeader,
      commentData,
    );
    const commentJson = await commentResponse.json();
    endpoint = `${apiEndpoints.comments}/${commentJson.id}`;
  });

  test('Should not delete a comment with a non-logged user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatusDelete = 401;
    const expectedResponseStatusGet = 200;
    // Act
    const response = await request.delete(endpoint);
    const actualResponseStatusDelete = response.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Comment exists after unsuccessful deletion
    await expectGetResponseStatus(request, endpoint, expectedResponseStatusGet);
  });

  test('Should delete a comment with a logged user', async ({ request }) => {
    // Arrange
    const expectedResponseStatusDelete = 200;
    const expectedResponseStatusGet = 404;
    // Act
    const responseDelete = await request.delete(endpoint, {
      headers: authorizationHeader,
    });
    const actualResponseStatusDelete = responseDelete.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Comment does not exist anymore
    await expectGetResponseStatus(request, endpoint, expectedResponseStatusGet);
  });
});
