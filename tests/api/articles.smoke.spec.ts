import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint @GAD-R08-01 @api', () => {
  const articlesEndpoint = '/api/articles';

  test('GET articles should return status code 200', async ({ request }) => {
    // Arrange
    const expectedResponseStatusCode = 200;
    // Act
    const response = await request.get(articlesEndpoint);
    // Assert
    expect(response.status()).toBe(expectedResponseStatusCode);
  });

  test('GET articles should return at least one article @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedMinArticlesCount = 1;
    // Act
    const response = await request.get(articlesEndpoint);
    const articles = await response.json();
    // Assert
    expect(articles.length).toBeGreaterThanOrEqual(expectedMinArticlesCount);
  });

  test('GET articles should return article object @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedRequiredFields = [
      'id',
      'user_id',
      'title',
      'body',
      'date',
      'image',
    ];
    // Act
    const response = await request.get(articlesEndpoint);
    const articles = await response.json();
    const firstArticle = articles[0];
    // Assert
    expectedRequiredFields.forEach((field) => {
      expect.soft(firstArticle).toHaveProperty(field);
    });
  });
});
