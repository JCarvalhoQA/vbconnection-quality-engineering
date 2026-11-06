import { Page, Route } from '@playwright/test';

export interface PersistAttemptLog {
  tentativas: string[];
  abortadas: string[];
}

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export type PersistGuardMode = 'mocked' | 'live-readonly';

export interface PersistGuardOptions {
  mode?: PersistGuardMode;
}

/**
 * URLs de persistência de negócio. Login/auth e consultas (servicos-cliente, destinos-combo) ficam de fora
 * no modo mocked. Live-readonly aborta qualquer mutação /api/ além do allowlist de autenticação.
 */
export const PERSIST_URL_PATTERN =
  /\/(contratos?(\/|$|\?)|aditiv|lotes?|imagens?|gravames?|b3\/|apontamento|upload|arquivos?|enviodocumento|enviar|salvar|gravar|incluir|persistir)/i;

const AUTH_ALLOWLIST = /\/auth\/(tokens|refresh|otp|2fa)(\/|$|\?)/i;

export function isPersistUrl(url: string): boolean {
  return PERSIST_URL_PATTERN.test(url);
}

export function isAuthAllowlist(url: string): boolean {
  return AUTH_ALLOWLIST.test(url);
}

export function isApiUrl(url: string): boolean {
  return /\/api\//i.test(url);
}

export function isAuthUrl(url: string): boolean {
  return /\/auth\//i.test(url);
}

export function shouldFallbackRegistrar(
  method: string,
  url: string,
  mode: PersistGuardMode = 'mocked',
): boolean {
  return mode === 'mocked' && method.toUpperCase() === 'POST' && /contratos\/registrar/.test(url);
}

export function shouldAbortPersist(
  method: string,
  url: string,
  mode: PersistGuardMode = 'mocked',
): boolean {
  if (!MUTATING.has(method.toUpperCase())) {
    return false;
  }
  if (isAuthAllowlist(url)) {
    return false;
  }
  if (mode === 'live-readonly') {
    return isPersistUrl(url) || isApiUrl(url);
  }
  if (!isPersistUrl(url)) {
    return false;
  }
  return !/contratos\/registrar/.test(url);
}

async function handlePersistRoute(route: Route, mode: PersistGuardMode): Promise<void> {
  const method = route.request().method();
  const url = route.request().url();

  if (shouldFallbackRegistrar(method, url, mode)) {
    await route.fallback();
    return;
  }

  if (shouldAbortPersist(method, url, mode)) {
    await route.abort('blockedbyclient');
    return;
  }

  await route.fallback();
}

function matchesGuardRoute(url: URL, mode: PersistGuardMode): boolean {
  const href = url.toString();
  if (isAuthUrl(href)) {
    return false;
  }
  if (mode === 'live-readonly') {
    return isPersistUrl(href) || isApiUrl(href);
  }
  return isPersistUrl(href);
}

/**
 * Intercepta persistência. Registrar por último (LIFO) nos testes mockados para o mock de
 * `contratos/registrar` responder. No live-readonly, aborta registrar e demais mutações de /api/.
 *
 * Limites conhecidos (não cobertos): WebSocket, Service Worker (Playwright `serviceWorkers: 'block'`
 * no config), form nativo para origem fora do padrão, outro BrowserContext, rotas instaladas
 * depois deste guard, GET com efeito colateral em URL de persistência.
 */
export async function installPersistGuard(page: Page, options: PersistGuardOptions = {}): Promise<void> {
  const mode = options.mode ?? 'mocked';
  await page.route((url) => matchesGuardRoute(url, mode), (route) => handlePersistRoute(route, mode));
}

function sanitizeAttemptUrl(url: string): string {
  return url.replace(/([?&](token|access_token|password|senha)=)[^&]+/gi, '$1[REDACTED]');
}

export function isMutatingMethod(method: string): boolean {
  return MUTATING.has(method.toUpperCase());
}

/**
 * Observa tentativas de escrita. Não substitui o guard: instale `installPersistGuard` antes.
 */
export function installPersistAttemptLog(page: Page): PersistAttemptLog {
  const log: PersistAttemptLog = { tentativas: [], abortadas: [] };

  page.on('request', (request) => {
    if (!isMutatingMethod(request.method())) {
      return;
    }
    const url = request.url();
    if (isAuthUrl(url) || isAuthAllowlist(url)) {
      return;
    }
    if (isApiUrl(url) || isPersistUrl(url)) {
      log.tentativas.push(`${request.method()} ${sanitizeAttemptUrl(url)}`);
    }
  });

  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText || '';
    if (!/blockedbyclient|ERR_BLOCKED/i.test(failure) || !isMutatingMethod(request.method())) {
      return;
    }
    log.abortadas.push(`${request.method()} ${sanitizeAttemptUrl(request.url())}`);
  });

  return log;
}
