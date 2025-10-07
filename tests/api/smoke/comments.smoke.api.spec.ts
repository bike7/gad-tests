import { apiEndpoints } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify comments API endpoint @GAD-R08-02 @smoke @comments', () => {
  test('GET comments should return status code 200', async ({ request }) => {
    // Arrange
    const expectedResponseStatusCode = 200;
    // Act
    const response = await request.get(apiEndpoints.comments);
    // Assert
    expect(response.status()).toBe(expectedResponseStatusCode);
  });

  test('GET comments should return at least one comment @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedMinCommentsCount = 1;
    // Act
    const response = await request.get(apiEndpoints.comments);
    const comments = await response.json();
    // Assert
    expect(comments.length).toBeGreaterThanOrEqual(expectedMinCommentsCount);
  });

  test('GET comments should return comment object @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedRequiredFields = [
      'id',
      'article_id',
      'user_id',
      'body',
      'date',
    ];
    // Act
    const response = await request.get(apiEndpoints.comments);
    const comments = await response.json();
    const firstComment = comments[0];
    // Assert
    expectedRequiredFields.forEach((field) => {
      expect
        .soft(firstComment, {
          message: `Incorrect or missing field on Comment object. Field: ${field}`,
        })
        .toHaveProperty(field);
    });
  });
});
