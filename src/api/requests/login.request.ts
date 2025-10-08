import { LoginData } from '@_src/api/models/login.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class LoginRequest {
  endpoint: string;

  constructor(protected request: APIRequestContext) {
    this.endpoint = apiEndpoints.login;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.endpoint);
  }

  async post(loginData: LoginData): Promise<APIResponse> {
    return await this.request.post(this.endpoint, {
      data: loginData,
    });
  }
}
