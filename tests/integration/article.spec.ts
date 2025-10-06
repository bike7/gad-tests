import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify article', () => {
  test(`Non logged user can access created article @GAD-R06-01 @predefined_data`, async ({
    articlePage,
  }) => {
    // Arrange
    const expectedArticleTitle = 'What is continuous integration?';
    //Act
    await articlePage.goTo('?id=55');
    // Assert
    await expect(articlePage.articleTitle).toContainText(expectedArticleTitle);
  });
});
