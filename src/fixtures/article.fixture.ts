import { prepareRandomArticle } from '@_src/factories/article.factory';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { test as baseTest } from '@playwright/test';

export const articleTest = baseTest.extend<ArticleFixtures>({
  createRandomArticle: async ({ page }, use) => {
    const articleData = prepareRandomArticle();
    const articlesPage = await new ArticlesPage(page).goTo();
    const addArticleView = await articlesPage.clickAddArticleButton();
    const articlePage = await addArticleView.createArticle(articleData);
    await use(articlePage);
  },
});

interface ArticleFixtures {
  createRandomArticle: ArticlePage;
}
