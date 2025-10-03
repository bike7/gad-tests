import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/models/article.model';

test.describe('Verify articles', () => {
  const testData1 = [{ field: 'title' }, { field: 'body' }];
  testData1.forEach(({ field }) => {
    test(`Try to create an article with missing ${field} @GAD-R04-01 @logged @negative`, async ({
      articlesPage,
    }) => {
      //Arrange
      const expectedAlertText = 'Article was not created';
      const articleData = prepareRandomArticle();
      (articleData as AddArticleModel)[field] = '';
      //Act
      const addArticleView = await articlesPage.clickAddArticleButton();
      await expect(addArticleView.pageHeader).toContainText(
        addArticleView.expectedPageHeaderText,
      );
      await addArticleView.createArticle(articleData);
      //Assert
      await expect(addArticleView.alertPopup).toContainText(expectedAlertText);
    });
  });

  const testData2 = [
    {
      description: 'exceeding 128 chars',
      articleData: prepareRandomArticle(129),
      expectedAlertText: 'Article was not created',
    },
    {
      description: 'having exactly 128 chars',
      articleData: prepareRandomArticle(128),
      expectedAlertText: 'Article was created',
    },
  ];
  testData2.forEach(({ description, articleData, expectedAlertText }) => {
    test(`Try to create an article with title ${description} @GAD-R04-02 @logged`, async ({
      articlesPage,
    }) => {
      //Arrange
      //Act
      const addArticleView = await articlesPage.clickAddArticleButton();
      await expect(addArticleView.pageHeader).toContainText(
        addArticleView.expectedPageHeaderText,
      );
      await addArticleView.createArticle(articleData);
      //Assert
      await expect(addArticleView.alertPopup).toContainText(expectedAlertText);
    });
  });
});
