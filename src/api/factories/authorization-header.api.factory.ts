import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/requests/api.endpoints';
import { testUser } from '@_src/ui/test.data/user.credentials.data';
import { APIRequestContext } from '@playwright/test';

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const userData = {
    email: testUser.userEmail,
    password: testUser.userPassword,
  };
  const response = await request.post(apiEndpoints.login, {
    data: userData,
  });
  const body = await response.json();
  const accessToken = body.access_token;
  return { Authorization: `Bearer ${accessToken}` };
}
