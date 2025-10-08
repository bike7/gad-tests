import { Headers } from '@_src/api/models/headers.api.model';
import { LoginData } from '@_src/api/models/login.api.model';
import { LoginRequest } from '@_src/api/requests/login.request';
import { testUser } from '@_src/ui/test.data/user.credentials.data';
import { APIRequestContext } from '@playwright/test';

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginData: LoginData = {
    email: testUser.userEmail,
    password: testUser.userPassword,
  };
  const loginRequest = new LoginRequest(request);
  const response = await loginRequest.post(loginData);
  const responseBody = await response.json();
  return { Authorization: `Bearer ${responseBody.access_token}` };
}
