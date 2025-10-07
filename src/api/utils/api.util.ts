import { testUser } from '@_src/ui/test.data/user.credentials.data';
import { APIRequestContext } from '@playwright/test';

export const apiEndpoints = {
  login: '/api/login',
  articles: '/api/articles',
  comments: '/api/comments',
};

export interface Headers {
  [key: string]: string;
}

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
