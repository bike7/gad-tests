import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { test as baseTest } from '@playwright/test';

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    await use(new ArticlesRequest(request));
  },
  articlesRequestLogged: async ({ request }, use) => {
    const authorizationHeader = await getAuthorizationHeader(request);
    await use(new ArticlesRequest(request, authorizationHeader));
  },
});

interface Requests {
  articlesRequest: ArticlesRequest;
  articlesRequestLogged: ArticlesRequest;
}
