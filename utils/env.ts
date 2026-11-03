export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const playwrightEnv = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://newfront.vbconnection.info',
  authURL: process.env.PLAYWRIGHT_AUTH_URL ?? 'https://hmg.vbconnection.info/vbauto.api/auth',
  apiURL: process.env.PLAYWRIGHT_API_URL ?? 'https://hmg.vbconnection.info/vbauto.api/api',
};
