import { apiEndpoints } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify articles API endpoint @GAD-R08-01 @smoke', () => {
  test.describe('Verify each condition in separate test', () => {
    test('GET articles should return status code 200', async ({ request }) => {
      // Arrange
      const expectedResponseStatusCode = 200;
      // Act
      const response = await request.get(apiEndpoints.articles);
      // Assert
      expect(response.status()).toBe(expectedResponseStatusCode);
    });

    test('GET articles should return at least one article @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedMinArticlesCount = 1;
      // Act
      const response = await request.get(apiEndpoints.articles);
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
      const response = await request.get(apiEndpoints.articles);
      const articles = await response.json();
      const firstArticle = articles[0];
      // Assert
      expectedRequiredFields.forEach((field) => {
        expect
          .soft(firstArticle, {
            message: `Incorrect or missing property on article: ${field}`,
          })
          .toHaveProperty(field);
      });
    });
  });

  test.describe('Verify each condition in separate test step', () => {
    test('GET articles should return an object with required fields @predefined_data', async ({
      request,
    }) => {
      const response = await request.get(apiEndpoints.articles);
      const articles = await response.json();

      await test.step('Should return status code 200', async ({}) => {
        const expectedResponseStatusCode = 200;
        expect(response.status()).toBe(expectedResponseStatusCode);
      });

      await test.step('Should return at least one article', async ({}) => {
        const expectedMinArticlesCount = 1;
        expect(articles.length).toBeGreaterThanOrEqual(
          expectedMinArticlesCount,
        );
      });

      await test.step('Should return article object', async ({}) => {
        const expectedRequiredFields = [
          'id',
          'user_id',
          'title',
          'body',
          'date',
          'image',
        ];
        const firstArticle = articles[0];
        expectedRequiredFields.forEach(async (field) => {
          await test.step(`Should verify field: ${field}`, async ({}) => {
            expect.soft(firstArticle).toHaveProperty(field);
          });
        });
      });
    });
  });
});
