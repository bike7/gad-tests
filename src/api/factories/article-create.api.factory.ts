import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { APIResponse, expect } from '@playwright/test';

export async function createArticleViaApi(
  articlesRequest: ArticlesRequest,
  articleData: ArticlePayload,
): Promise<APIResponse> {
  const articleResponse = await articlesRequest.post(articleData);
  // Verify article exist
  const article = await articleResponse.json();
  await expect(async () => {
    const responseVerify = await articlesRequest.get(article.id);
    await expect(responseVerify).toBeOK();
  }).toPass();
  return articleResponse;
}
