import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main menu buttons', () => {
  test('Comments button navigates to Comments page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = await new ArticlesPage(page).goTo();
    // Act
    const commentsPage = await articlesPage.mainMenu.clickCommentsButton();
    // Assert
    const actualPageTitle = await commentsPage.getTitle();
    expect(actualPageTitle).toContain(commentsPage.expectedPageTitle);
  });
  test('Articles button navigates to Articles page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const commentsPage = await new CommentsPage(page).goTo();
    // Act
    const articlesPage = await commentsPage.mainMenu.clickArticlesButton();
    // Assert
    const actualPageTitle = await articlesPage.getTitle();
    expect(actualPageTitle).toContain(articlesPage.expectedPageTitle);
  });
  test('Home page link navigates to Home page (from articles) @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = await new ArticlesPage(page).goTo();
    // Act
    const homePage = await articlesPage.mainMenu.clickHomePageLink();
    // Assert
    const actualPageTitle = await homePage.getTitle();
    expect(actualPageTitle).toContain(homePage.expectedPageTitle);
  });
  test('Home page link navigates to Home page (from comments) @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const commentsPage = await new CommentsPage(page).goTo();
    // Act
    const homePage = await commentsPage.mainMenu.clickHomePageLink();
    // Assert
    const actualPageTitle = await homePage.getTitle();
    expect(actualPageTitle).toContain(homePage.expectedPageTitle);
  });
});
