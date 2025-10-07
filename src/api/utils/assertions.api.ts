import { APIRequestContext, expect } from '@playwright/test';

export async function expectGetResponseStatus(
  request: APIRequestContext,
  endpoint: string,
  expectedResponseStatus: number,
): Promise<void> {
  const response = await request.get(endpoint);
  const actualResponseStatus = response.status();
  expect(
    actualResponseStatus,
    `Expected status code: ${expectedResponseStatus}, but received: ${actualResponseStatus}`,
  ).toBe(expectedResponseStatus);
}
