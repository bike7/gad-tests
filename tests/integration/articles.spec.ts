import { RESPONSE_TIMEOUT } from '@_pw-config';
import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/models/article.model';

test.describe('Verify articles', () => {
  const testData1 = [{ field: 'title' }, { field: 'body' }];
  testData1.forEach(({ field }) => {
    test(`Try to create an article with missing ${field} @GAD-R04-01 @logged @negative`, async ({
      addArticleView,
      page,
    }) => {
      //Arrange
      const articleData = prepareRandomArticle();
      (articleData as AddArticleModel)[field] = '';
      const expectedAlertText = 'Article was not created';
      const expectedResponseStatusCode = 422;
      const expectedResponseErrorMessage = 'One of mandatory field is missing';
      //Act
      await expect(addArticleView.pageHeader).toContainText(
        addArticleView.expectedPageHeaderText,
      );
      const responsePromise = page.waitForResponse('/api/articles*', {
        timeout: RESPONSE_TIMEOUT,
      });
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;
      const body = await response.json();
      //Assert
      await expect
        .soft(addArticleView.alertPopup)
        .toContainText(expectedAlertText);
      expect.soft(response.status()).toBe(expectedResponseStatusCode);
      expect.soft(body.error.message).toContain(expectedResponseErrorMessage);
    });
  });

  test(`Try to create an article with title exceeding 128 chars @GAD-R04-02 @logged`, async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const articleData = prepareRandomArticle(129);
    const expectedAlertText = 'Article was not created';
    const expectedResponseStatusCode = 422;
    const expectedResponseErrorMessage =
      'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "title" longer than "128"';
    //Act
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    const responsePromise = page.waitForResponse('/api/articles', {
      timeout: RESPONSE_TIMEOUT,
    });
    await addArticleView.createArticle(articleData);
    //Assert
    const response = await responsePromise;
    const body = await response.json();
    await expect
      .soft(addArticleView.alertPopup)
      .toContainText(expectedAlertText);
    expect.soft(response.status()).toBe(expectedResponseStatusCode);
    expect.soft(body.error.message).toContain(expectedResponseErrorMessage);
  });

  test(`Create an article with title having exactly 128 chars @GAD-R04-02 @logged`, async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const articleTestData = prepareRandomArticle(128);
    const expectedAlertText = 'Article was created';
    //Act
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    const responsePromise = page.waitForResponse('/api/articles/*', {
      timeout: RESPONSE_TIMEOUT,
    });
    await addArticleView.createArticle(articleTestData);
    //Assert
    const response = await responsePromise;
    const responseBody = await response.json();
    await expect
      .soft(addArticleView.alertPopup)
      .toContainText(expectedAlertText);
    expect.soft(response.ok()).toBeTruthy();
    expect.soft(responseBody.body).toBe(articleTestData.body);
    expect.soft(responseBody.title).toBe(articleTestData.title);
  });
});
