import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  endpoint: string;

  constructor(
    protected request: APIRequestContext,
    protected authorizationHeader?: Headers,
  ) {
    this.endpoint = apiEndpoints.articles;
  }

  async get(articleId?: number): Promise<APIResponse> {
    const url = articleId ? `${this.endpoint}/${articleId}` : this.endpoint;
    const response = await this.request.get(url);
    return response;
  }

  async post(articleData: ArticlePayload): Promise<APIResponse> {
    const response = await this.request.post(this.endpoint, {
      headers: this.authorizationHeader,
      data: articleData,
    });
    return response;
  }

  async put(
    articleId: number,
    articleData: ArticlePayload,
  ): Promise<APIResponse> {
    const response = await this.request.put(`${this.endpoint}/${articleId}`, {
      headers: this.authorizationHeader,
      data: articleData,
    });
    return response;
  }

  async patch(
    articleId: number,
    articleData: Partial<ArticlePayload>,
  ): Promise<APIResponse> {
    const response = await this.request.patch(`${this.endpoint}/${articleId}`, {
      headers: this.authorizationHeader,
      data: articleData,
    });
    return response;
  }
}
