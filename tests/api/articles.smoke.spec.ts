import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint', () => {
  test('GET articles returns status code 200 @GAD-R08-01 @api', async ({
    request,
  }) => {
    // Arrange
    const articlesEndpoint = '/api/articles';
    const expectedResponseStatusCode = 200;
    // Act
    const response = await request.get(articlesEndpoint);
    // Assert
    expect(response.status()).toBe(expectedResponseStatusCode);
  });
});
