import { DEFAULT_API_URL, DEFAULT_AUTH_URL, DEFAULT_NEWFRONT_URL } from '../config/environments';

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const playwrightEnv = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_NEWFRONT_URL,
  authURL: process.env.PLAYWRIGHT_AUTH_URL ?? DEFAULT_AUTH_URL,
  apiURL: process.env.PLAYWRIGHT_API_URL ?? DEFAULT_API_URL,
};
