import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { test as baseTest } from '@playwright/test';

export const pageObjectTest = baseTest.extend<Pages>({
  articlesPage: async ({ page }, use) => {
    await use(await new ArticlesPage(page).goTo());
  },
  commentsPage: async ({ page }, use) => {
    await use(await new CommentsPage(page).goTo());
  },
});

interface Pages {
  articlesPage: ArticlesPage;
  commentsPage: CommentsPage;
}
