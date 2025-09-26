import { randomNewArticleData } from '../../src/factories/article.factory';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test('Create new article @GAD-R04-01', async ({ page }) => {
    // Arrange
    const articleData = randomNewArticleData();
    const expectedAlertText = 'Article was created';
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser);
    //Act
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await articlesPage.addArticleButton.click();
    const addArticleView = new AddArticleView(page);
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    await addArticleView.createArticle(articleData);
    //Assert
    await expect(addArticleView.confirmationAlert).toContainText(
      expectedAlertText,
    );
    const articlePage = new ArticlePage(page);
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body);
  });
});
