import { prepareRandomArticle } from '../../src/factories/article.factory';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    await loginPage.goTo();
    await loginPage.loginAs(testUser);
  });

  const testData1 = [{ field: 'title' }, { field: 'body' }];
  testData1.forEach(({ field }) => {
    test(`Try to create an article with missing ${field} @GAD-R04-01 @negative`, async ({}) => {
      //Arrange
      const expectedAlertText = 'Article was not created';
      const articleData = prepareRandomArticle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (articleData as any)[field] = '';
      //Act
      await articlesPage.goTo();
      await articlesPage.addArticleButton.click();
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
    test(`Try to create an article with title ${description} @GAD-R04-02`, async ({}) => {
      //Arrange
      //Act
      await articlesPage.goTo();
      await articlesPage.addArticleButton.click();
      await expect(addArticleView.pageHeader).toContainText(
        addArticleView.expectedPageHeaderText,
      );
      await addArticleView.createArticle(articleData);
      //Assert
      await expect(addArticleView.alertPopup).toContainText(expectedAlertText);
    });
  });
});
