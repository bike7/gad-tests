import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify main pages', () => {
  test('Home page title @smoke @GAD-R01-01', async ({ homePage }) => {
    // Act
    const title = await homePage.getTitle();
    // Assert
    expect(title).toContain(homePage.expectedPageTitle);
  });

  test('Articles page title @smoke @GAD-R01-02', async ({ articlesPage }) => {
    // Act
    const title = await articlesPage.getTitle();
    // Assert
    expect(title).toContain(articlesPage.expectedPageTitle);
  });

  test('Comments page title @smoke @GAD-R01-02', async ({ commentsPage }) => {
    // Act
    const title = await commentsPage.getTitle();
    // Assert
    expect(title).toContain(commentsPage.expectedPageTitle);
  });
});
