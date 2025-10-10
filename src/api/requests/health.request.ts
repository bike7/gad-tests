import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class HealthRequest {
  endpoint: string;
  healthStatusOK: unknown;

  constructor(protected request: APIRequestContext) {
    this.endpoint = apiEndpoints.healthCheck;
    this.healthStatusOK = 'OK';
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.endpoint);
  }
}
