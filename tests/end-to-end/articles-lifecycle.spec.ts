import { prepareRandomArticle } from '@_src/factories/article.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete article', () => {
  let articleData: AddArticleModel;
  let articlesPage: ArticlesPage;
  let articlePage: ArticlePage;
  test.beforeEach(async ({ page }) => {
    articlesPage = await new ArticlesPage(page).goTo();
    articlePage = new ArticlePage(page);
  });

  test('Create a new article @GAD-R04-01 @logged', async ({ page }) => {
    // Arrange
    const expectedAlertText = 'Article was created';
    articleData = prepareRandomArticle();
    const addArticleView = new AddArticleView(page);
    //Act
    await articlesPage.addArticleButton.click();
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    await addArticleView.createArticle(articleData);
    //Assert
    await expect(addArticleView.alertPopup).toContainText(expectedAlertText);
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body);
  });

  test('User can access single article @GAD-R04-03 @logged', async ({}) => {
    // Arrange
    //Act
    await articlesPage.goToArticle(articleData.title);
    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body);
  });

  test('User can delete his own article @GAD-R04-04 @logged', async ({}) => {
    // Arrange
    const expectedSearchResultText = 'No data';
    //Act
    await articlesPage.goToArticle(articleData.title);
    await articlePage.deleteArticle();
    //Assert
    await articlesPage.waitForPageToLoadUrl();
    const title = await articlesPage.getTitle();
    expect(title).toContain(articlesPage.expectedPageTitle);
    await articlesPage.searchForArticle(articleData.title);
    await expect(articlesPage.noResultsText).toHaveText(
      expectedSearchResultText,
    );
  });
});
