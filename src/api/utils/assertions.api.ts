import { APIRequestContext, expect } from '@playwright/test';

export async function expectGetResponseStatus(
  request: APIRequestContext,
  endpoint: string,
  expectedResponseStatus: number,
): Promise<void> {
  const response = await request.get(endpoint);
  const actualResponseStatus = response.status();
  expectStatusToBe(actualResponseStatus, expectedResponseStatus);
}

export function expectStatusToBe(
  actualStatus: number,
  expectedStatus: number,
): void {
  expect(
    actualStatus,
    `Expected status code: ${expectedStatus}, but received: ${actualStatus}`,
  ).toBe(expectedStatus);
}
