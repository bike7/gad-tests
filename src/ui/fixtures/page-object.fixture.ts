import { ArticlePage } from '@_src/ui/pages/article.page';
import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { CommentsPage } from '@_src/ui/pages/comments.page';
import { HomePage } from '@_src/ui/pages/home.page';
import { LoginPage } from '@_src/ui/pages/login.page';
import { RegisterPage } from '@_src/ui/pages/register.page';
import { AddArticleView } from '@_src/ui/views/add-article.view';
import { test as baseTest } from '@playwright/test';

export const pageObjectTest = baseTest.extend<Pages>({
  addArticleView: async ({ articlesPage }, use) => {
    await use(await articlesPage.clickAddArticleButton());
  },
  articlesPage: async ({ page }, use) => {
    await use(await new ArticlesPage(page).goTo());
  },
  articlePage: async ({ page }, use) => {
    await use(await new ArticlePage(page));
  },
  commentsPage: async ({ page }, use) => {
    await use(await new CommentsPage(page).goTo());
  },
  homePage: async ({ page }, use) => {
    await use(await new HomePage(page).goTo());
  },
  loginPage: async ({ page }, use) => {
    await use(await new LoginPage(page).goTo());
  },
  registerPage: async ({ page }, use) => {
    await use(await new RegisterPage(page).goTo());
  },
});

interface Pages {
  addArticleView: AddArticleView;
  articlesPage: ArticlesPage;
  articlePage: ArticlePage;
  commentsPage: CommentsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}
