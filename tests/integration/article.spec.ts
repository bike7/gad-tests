import { ArticlePage } from '@_src/pages/article.page';
import test, { expect } from '@playwright/test';

test.describe('Verify article', () => {
  test(`Non logged user can access created article @GAD-R06-01 @predefined_data`, async ({
    page,
  }) => {
    // Arrange
    const expectedArticleTitle = 'What is continuous integration?';
    //Act
    const articlePage = await new ArticlePage(page).goTo('?id=55');
    // Assert
    await expect(articlePage.articleTitle).toContainText(expectedArticleTitle);
  });
});
