import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  endpoint: string;
  constructor(protected request: APIRequestContext) {
    this.endpoint = apiEndpoints.articles;
  }

  async get(): Promise<APIResponse> {
    const response = await this.request.get(this.endpoint);
    return response;
  }
}
