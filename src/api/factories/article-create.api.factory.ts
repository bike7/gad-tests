import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function createArticleViaApi(
  request: APIRequestContext,
  headers: Headers,
  articleData: ArticlePayload,
): Promise<APIResponse> {
  const articleResponse = await request.post(apiEndpoints.articles, {
    headers: headers,
    data: articleData,
  });
  // Verify article exist
  const article = await articleResponse.json();
  await expect(async () => {
    const responseVerify = await request.get(
      `${apiEndpoints.articles}/${article.id}`,
    );
    await expect(responseVerify).toBeOK();
  }).toPass();
  return articleResponse;
}
