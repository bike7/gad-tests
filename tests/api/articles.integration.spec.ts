import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser } from '@_src/test.data/user.credentials.data';

test.describe('Verify articles CRUD operations @GAD-R09-01 @api', () => {
  const articlesEndpoint = '/api/articles';
  test('Should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedResponseStatusCode = 401;
    const expectedErrorMessage = 'Access token not provided!';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2025-10-06T12:34:28.190Z',
      image: '.\\data\\images\\256\\mahdikordi-4hCYZT_zPu8-unsplash.jpg',
    };
    // Act
    const response = await request.post(articlesEndpoint, {
      data: articleData,
    });
    const responseBody = await response.json();
    // Assert
    expect.soft(response.status()).toBe(expectedResponseStatusCode);
    expect.soft(responseBody.error.message).toContain(expectedErrorMessage);
  });

  test('Should create an article with a logged user', async ({ request }) => {
    // Arrange
    const expectedResponseStatusCode = 201;
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2025-10-06T12:34:28.190Z',
      image: '.\\data\\images\\256\\mahdikordi-4hCYZT_zPu8-unsplash.jpg',
    };
    //Login
    const userData = {
      email: testUser.userEmail,
      password: testUser.userPassword,
    };
    const loginEndpoint = '/api/login';
    const responseLogin = await request.post(loginEndpoint, {
      data: userData,
    });
    const responseLoginBody = await responseLogin.json();
    const accessToken = responseLoginBody.access_token;
    const header = { Authorization: `Bearer ${accessToken}` };
    // Act
    const response = await request.post(articlesEndpoint, {
      data: articleData,
      headers: header,
    });
    const actualResponseStatus = response.status();
    const actualResponseBody = await response.json();
    // Assert
    expect(
      actualResponseStatus,
      `Expected status code: ${expectedResponseStatusCode}, but received: ${actualResponseStatus}`,
    ).toBe(expectedResponseStatusCode);
    expect.soft(actualResponseBody.title).toBe(articleData.title);
    expect.soft(actualResponseBody.body).toBe(articleData.body);
  });
});
