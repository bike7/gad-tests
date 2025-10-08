import { expect, test } from '@_src/merge.fixture';

test.describe('Verify articles API endpoint @GAD-R08-01 @smoke @articles', () => {
  test.describe('Verify each condition in separate test', () => {
    test('GET articles should return status code 200', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedResponseStatusCode = 200;
      // Act
      const response = await articlesRequest.get();
      // Assert
      expect(response.status()).toBe(expectedResponseStatusCode);
    });

    test('GET articles should return at least one article @predefined_data', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedMinArticlesCount = 1;
      // Act
      const response = await articlesRequest.get();
      const articles = await response.json();
      // Assert
      expect(articles.length).toBeGreaterThanOrEqual(expectedMinArticlesCount);
    });

    test('GET articles should return article object @predefined_data', async ({
      articlesRequest,
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
      const response = await articlesRequest.get();
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
      articlesRequest,
    }) => {
      const response = await articlesRequest.get();
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
