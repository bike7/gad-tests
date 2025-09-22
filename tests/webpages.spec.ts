import { ArticlesPage } from '../src/pages/articles.page';
import { CommentsPage } from '../src/pages/comments.page';
import { HomePage } from '../src/pages/home.page';
import { expect, test } from '@playwright/test';

test('home page title @smoke @GAD-R01-01', async ({ page }) => {
  // Arrange
  const expectedTitle = 'GAD';
  const homePage = new HomePage(page);
  // Act
  await homePage.goto();
  // Assert
  const title = await homePage.title();
  expect(title).toContain(expectedTitle);
});

test('articles page title @smoke @GAD-R01-02', async ({ page }) => {
  // Arrange
  const expectedTitle = 'Articles';
  const articlesPage = new ArticlesPage(page);
  // Act
  await articlesPage.goto();
  // Assert
  const title = await articlesPage.title();
  expect(title).toContain(expectedTitle);
});

test('comments page title @smoke @GAD-R01-02', async ({ page }) => {
  // Arrange
  const expectedTitle = 'Comments';
  const commentsPage = new CommentsPage(page);
  // Act
  await commentsPage.goto();
  // Assert
  const title = await commentsPage.title();
  expect(title).toContain(expectedTitle);
});
