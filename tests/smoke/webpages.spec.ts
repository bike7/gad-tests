import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main pages', () => {
  test('Home page title @smoke @GAD-R01-01', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    // Act
    await homePage.goTo();
    // Assert
    const title = await homePage.getTitle();
    expect(title).toContain(homePage.expectedPageTitle);
  });

  test('Articles page title @smoke @GAD-R01-02', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);
    // Act
    await articlesPage.goTo();
    // Assert
    const title = await articlesPage.getTitle();
    expect(title).toContain(articlesPage.expectedPageTitle);
  });

  test('Comments page title @smoke @GAD-R01-02', async ({ page }) => {
    // Arrange
    const commentsPage = new CommentsPage(page);
    // Act
    await commentsPage.goTo();
    // Assert
    const title = await commentsPage.getTitle();
    expect(title).toContain(commentsPage.expectedPageTitle);
  });
});
