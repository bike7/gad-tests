import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main pages', () => {
  test('Home page title @smoke @GAD-R01-01', async ({ page }) => {
    // Arrange
    const homePage = await new HomePage(page).goTo();
    // Act
    const title = await homePage.getTitle();
    // Assert
    expect(title).toContain(homePage.expectedPageTitle);
  });

  test('Articles page title @smoke @GAD-R01-02', async ({ page }) => {
    // Arrange
    const articlesPage = await new ArticlesPage(page).goTo();
    // Act
    const title = await articlesPage.getTitle();
    // Assert
    expect(title).toContain(articlesPage.expectedPageTitle);
  });

  test('Comments page title @smoke @GAD-R01-02', async ({ page }) => {
    // Arrange
    const commentsPage = await new CommentsPage(page).goTo();
    // Act
    const title = await commentsPage.getTitle();
    // Assert
    expect(title).toContain(commentsPage.expectedPageTitle);
  });
});
