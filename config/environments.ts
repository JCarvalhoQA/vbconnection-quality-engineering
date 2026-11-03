/**
 * URLs da suíte Playwright. Os valores reais vêm de variáveis de ambiente;
 * os defaults abaixo não contêm credencial.
 */
export const DEFAULT_LOCAL_URL = 'http://localhost:8080';
export const DEFAULT_HOMOLOGATION_URL = 'https://hmg.vbconnection.info';
export const DEFAULT_NEWFRONT_URL = 'https://newfront.vbconnection.info';
export const DEFAULT_AUTH_URL = 'https://hmg.vbconnection.info/vbauto.api/auth';
export const DEFAULT_API_URL = 'https://hmg.vbconnection.info/vbauto.api/api';

export function resolveLocalBaseURL(): string {
  return process.env.PLAYWRIGHT_LOCAL_URL ?? process.env.PLAYWRIGHT_DOCKER_URL ?? DEFAULT_LOCAL_URL;
}

export function resolveHomologationBaseURL(): string {
  return process.env.PLAYWRIGHT_HMG_URL ?? DEFAULT_HOMOLOGATION_URL;
}

export function resolveNewfrontBaseURL(): string {
  return process.env.PLAYWRIGHT_NEWFRONT_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_NEWFRONT_URL;
}

export function resolveAuthURL(): string {
  return process.env.PLAYWRIGHT_AUTH_URL ?? DEFAULT_AUTH_URL;
}

export function resolveApiURL(): string {
  return process.env.PLAYWRIGHT_API_URL ?? DEFAULT_API_URL;
}
