import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main menu buttons', () => {
  test('comments button navigates to comments page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'Comments';
    // Act
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await articlesPage.mainMenu.clickCommentsButton();
    // Assert
    const commentsPage = new CommentsPage(page);
    const actualPageTitle = await commentsPage.title();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
  test('articles button navigates to articles page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'Articles';
    // Act
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await commentsPage.mainMenu.clickArticlesButton();
    // Assert
    const articlesPage = new ArticlesPage(page);
    const actualPageTitle = await articlesPage.title();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
  test('home page link navigates to home page from articles page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'GAD';
    // Act
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await articlesPage.mainMenu.clickHomePageLink();
    // Assert
    const homePage = new HomePage(page);
    const actualPageTitle = await homePage.title();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
  test('home page link navigates to home page from comments page @smoke @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedPageTitle = 'GAD';
    // Act
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await commentsPage.mainMenu.clickHomePageLink();
    // Assert
    const homePage = new HomePage(page);
    const actualPageTitle = await homePage.title();
    expect(actualPageTitle).toContain(expectedPageTitle);
  });
});
