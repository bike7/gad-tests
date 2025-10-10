import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { expect } from '@playwright/test';

export async function expectGetResponseStatus(
  requestObject: ArticlesRequest | CommentsRequest,
  objectId: number,
  expectedResponseStatus: number,
): Promise<void> {
  const response = await requestObject.get(objectId);
  const actualResponseStatus = response.status();
  expect(
    actualResponseStatus,
    `Expected status code: ${expectedResponseStatus}, but received: ${actualResponseStatus}`,
  ).toBe(expectedResponseStatus);
}
