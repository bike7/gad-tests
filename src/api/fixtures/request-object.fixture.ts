import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { test as baseTest } from '@playwright/test';

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    await use(new ArticlesRequest(request));
  },
});

interface Requests {
  articlesRequest: ArticlesRequest;
}
