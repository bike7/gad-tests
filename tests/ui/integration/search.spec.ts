import { expect, test } from '@_src/merge.fixture';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('Verify search component for articles', () => {
  test('Go button should fetch articles @GAD-R07-01', async ({
    articlesPage,
    page,
  }) => {
    // Arrange
    const expectedResponseUrl = '/api/articles';
    const expectedResponseMethod = 'GET';
    const expectedArticleNumber = 6;
    await expect(articlesPage.goSearchButton).toBeInViewport();
    const responsePromise = waitForResponse(page, expectedResponseUrl);
    // Act
    await articlesPage.goSearchButton.click();
    const response = await responsePromise;
    const body = await response.json();
    // Assert
    expect.soft(response.ok()).toBeTruthy();
    expect.soft(response.request().method()).toBe(expectedResponseMethod);
    expect.soft(body).toHaveLength(expectedArticleNumber);
  });
});
