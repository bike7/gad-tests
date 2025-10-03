import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { LoginPage } from '@_src/pages/login.page';
import { RegisterPage } from '@_src/pages/register.page';
import { test as baseTest } from '@playwright/test';

export const pageObjectTest = baseTest.extend<Pages>({
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
  articlesPage: ArticlesPage;
  articlePage: ArticlePage;
  commentsPage: CommentsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}
