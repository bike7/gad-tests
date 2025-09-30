import { STORAGE_STATE } from '../playwright.config';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ override: true });

export default globalSetup;
async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
}
export const BASE_URL = requireEnvVariable('BASE_URL');
export const USER_EMAIL = requireEnvVariable('USER_EMAIL');
export const USER_PASSWORD = requireEnvVariable('USER_PASSWORD');

function requireEnvVariable(envVariableName: string): string {
  const envVariableValue = process.env[envVariableName];
  if (envVariableValue === undefined || envVariableValue === '') {
    throw new Error(
      `Missing required environment variable: ${envVariableName} . Please ensure you have set BASE_URL, USER_EMAIL, and USER_PASSWORD in your.env file.`,
    );
  }
  return envVariableValue;
}
