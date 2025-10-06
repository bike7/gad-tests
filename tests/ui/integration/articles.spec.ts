import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/models/article.model';
import { waitForResponse } from '@_src/utils/wait.util';

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
      const expectedResponseUrl = '/api/articles';
      const expectedResponseMethod = 'POST';
      const expectedResponseStatusCode = 422;
      const expectedResponseErrorMessage = 'One of mandatory field is missing';
      //Act
      await expect(addArticleView.pageHeader).toContainText(
        addArticleView.expectedPageHeaderText,
      );
      const responsePromise = waitForResponse(
        page,
        expectedResponseUrl,
        expectedResponseMethod,
        expectedResponseStatusCode,
      );
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;
      const body = await response.json();
      //Assert
      await expect
        .soft(addArticleView.alertPopup)
        .toContainText(expectedAlertText);
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
    const expectedResponseUrl = '/api/articles';
    const expectedResponseMethod = 'POST';
    const expectedResponseStatusCode = 422;
    const expectedResponseErrorMessage =
      'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "title" longer than "128"';
    //Act
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    const responsePromise = waitForResponse(
      page,
      expectedResponseUrl,
      expectedResponseMethod,
      expectedResponseStatusCode,
    );
    await addArticleView.createArticle(articleData);
    //Assert
    const response = await responsePromise;
    const body = await response.json();
    await expect
      .soft(addArticleView.alertPopup)
      .toContainText(expectedAlertText);
    expect.soft(body.error.message).toContain(expectedResponseErrorMessage);
  });

  test(`Create an article with title having exactly 128 chars @GAD-R04-02 @GAD-R07-03 @logged`, async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const articleTestData = prepareRandomArticle(128);
    const expectedAlertText = 'Article was created';
    const expectedResponseUrl = '/api/articles';
    const expectedResponseMethod = 'GET';
    const expectedResponseStatusCode = 200;
    //Act
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    const responsePromise = waitForResponse(
      page,
      expectedResponseUrl,
      expectedResponseMethod,
      expectedResponseStatusCode,
    );
    await addArticleView.createArticle(articleTestData);
    //Assert
    const response = await responsePromise;
    const responseBody = await response.json();
    await expect
      .soft(addArticleView.alertPopup)
      .toContainText(expectedAlertText);
    expect.soft(responseBody.body).toBe(articleTestData.body);
    expect.soft(responseBody.title).toBe(articleTestData.title);
  });

  test(`Should return created article from API @GAD-R07-03 @GAD-R07-04 @logged`, async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const articleTestData = prepareRandomArticle();
    const expectedAlertText = 'Article was created';
    const expectedResponseUrl = '/api/articles';
    const expectedResponseMethod = 'GET';
    const expectedResponseStatusCode = 200;
    //Act
    await expect(addArticleView.pageHeader).toContainText(
      addArticleView.expectedPageHeaderText,
    );
    const responsePromise = waitForResponse(
      page,
      expectedResponseUrl,
      expectedResponseMethod,
      expectedResponseStatusCode,
    );
    await addArticleView.createArticle(articleTestData);
    //Assert
    const response = await responsePromise;
    const responseBody = await response.json();
    await expect
      .soft(addArticleView.alertPopup)
      .toContainText(expectedAlertText);
    expect.soft(responseBody.body).toBe(articleTestData.body);
    expect.soft(responseBody.title).toBe(articleTestData.title);
  });
});
