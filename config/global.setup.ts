import { BASE_URL } from '@_config/env.config';
import { STORAGE_STATE } from '@_pw-config';
import { request } from '@playwright/test';
import * as fs from 'fs';

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
  const requestContext = await request.newContext();
  try {
    await requestContext.get(BASE_URL);
  } catch {
    throw new Error(
      `❌ Failed to connect to ${BASE_URL!}. Please make sure the application is running and the baseUrl is correct`,
    );
  }
}

export default globalSetup;
