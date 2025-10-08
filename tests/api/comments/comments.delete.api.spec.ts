import { createArticleViaApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { createCommentViaApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { expectGetResponseStatus } from '@_src/api/utils/assertions.api';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify comments DELETE operations @GAD-R09-04 @crud @delete @comments', () => {
  let articleId: number;
  let createdCommentId: number;

  test.beforeAll(
    'Should login and create an article',
    async ({ articlesRequestLogged }) => {
      const articleData = prepareArticlePayload();
      const response = await createArticleViaApi(
        articlesRequestLogged,
        articleData,
      );
      const createdArticle = await response.json();
      articleId = createdArticle.id;
    },
  );

  test.beforeEach(
    'Should create a comment',
    async ({ commentsRequestLogged }) => {
      const commentData = prepareCommentPayload(articleId);
      const commentResponse = await createCommentViaApi(
        commentsRequestLogged,
        commentData,
      );
      const commentJson = await commentResponse.json();
      createdCommentId = commentJson.id;
    },
  );

  test('Should not delete a comment with a non-logged user', async ({
    commentsRequest,
  }) => {
    // Arrange
    const expectedResponseStatusDelete = 401;
    const expectedResponseStatusGet = 200;
    // Act
    const response = await commentsRequest.delete(createdCommentId);
    const actualResponseStatusDelete = response.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Comment exists after unsuccessful deletion
    await expectGetResponseStatus(
      commentsRequest,
      createdCommentId,
      expectedResponseStatusGet,
    );
  });

  test('Should delete a comment with a logged user', async ({
    commentsRequestLogged,
  }) => {
    // Arrange
    const expectedResponseStatusDelete = 200;
    const expectedResponseStatusGet = 404;
    // Act
    const responseDelete = await commentsRequestLogged.delete(createdCommentId);
    const actualResponseStatusDelete = responseDelete.status();
    // Assert DELETE status
    expect(actualResponseStatusDelete).toBe(expectedResponseStatusDelete);
    // Assert Comment does not exist anymore
    await expectGetResponseStatus(
      commentsRequestLogged,
      createdCommentId,
      expectedResponseStatusGet,
    );
  });
});
