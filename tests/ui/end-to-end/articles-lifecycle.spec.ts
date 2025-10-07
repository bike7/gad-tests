import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/ui/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete article', () => {
  let articleData: AddArticleModel;

  test('Create a new article @GAD-R04-01 @logged', async ({
    addArticleView,
  }) => {
    // Arrange
    const expectedAlertText = 'Article was created';
    articleData = prepareRandomArticle();
    //Act
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    const articlePage = await addArticleView.createArticle(articleData);
    //Assert
    await expect(addArticleView.alertPopup).toContainText(expectedAlertText);
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body);
  });

  test('User can access single article @GAD-R04-03 @logged', async ({
    articlesPage,
  }) => {
    // Arrange
    //Act
    const articlePage = await articlesPage.goToArticle(articleData.title);
    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body);
  });

  test('User can delete his own article @GAD-R04-04 @logged', async ({
    articlesPage,
  }) => {
    // Arrange
    const expectedSearchResultText = 'No data';
    //Act
    const articlePage = await articlesPage.goToArticle(articleData.title);
    articlesPage = await articlePage.deleteArticle();
    //Assert
    articlesPage = await articlesPage.waitForPageToLoadUrl();
    const title = await articlesPage.getTitle();
    expect(title).toContain(articlesPage.expectedPageTitle);
    articlesPage = await articlesPage.searchForArticle(articleData.title);
    await expect(articlesPage.noResultsText).toHaveText(
      expectedSearchResultText,
    );
  });
});
