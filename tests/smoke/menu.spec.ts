import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main menu buttons', () => {
  test('Comments button navigates to Comments page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'Comments';
    // Act
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goTo();
    await articlesPage.mainMenu.clickCommentsButton();
    // Assert
    const commentsPage = new CommentsPage(page);
    const actualPageTitle = await commentsPage.getTitle();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
  test('Articles button navigates to Articles page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'Articles';
    // Act
    const commentsPage = new CommentsPage(page);
    await commentsPage.goTo();
    await commentsPage.mainMenu.clickArticlesButton();
    // Assert
    const articlesPage = new ArticlesPage(page);
    const actualPageTitle = await articlesPage.getTitle();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
  test('Home page link navigates to Home page (from articles) @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'GAD';
    // Act
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goTo();
    await articlesPage.mainMenu.clickHomePageLink();
    // Assert
    const homePage = new HomePage(page);
    const actualPageTitle = await homePage.getTitle();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
  test('Home page link navigates to Home page (from comments) @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'GAD';
    // Act
    const commentsPage = new CommentsPage(page);
    await commentsPage.goTo();
    await commentsPage.mainMenu.clickHomePageLink();
    // Assert
    const homePage = new HomePage(page);
    const actualPageTitle = await homePage.getTitle();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
});
