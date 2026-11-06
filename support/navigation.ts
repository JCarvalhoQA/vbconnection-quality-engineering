import { Page } from '@playwright/test';

const LOGIN_PATHS = new Set(['/', '/login']);

export function isLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return LOGIN_PATHS.has(path) || path.startsWith('/login/');
}

export function isLoginUrl(url: URL): boolean {
  return isLoginPath(url.pathname);
}

export function normalizeAppPath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  if (path.startsWith('http')) {
    const url = new URL(path);
    return `${url.pathname}${url.search}` || '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

export function pathnameMatchesTarget(pathname: string, target: string): boolean {
  const want = (target.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  const got = pathname.replace(/\/+$/, '') || '/';
  return got === want || got.endsWith(want);
}

export async function hideThirdPartyOverlays(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      #blip-chat-container,
      #blip-chat-open-iframe,
      #blip-chat-iframe {
        display: none !important;
        pointer-events: none !important;
      }
    `,
  });
}

/**
 * Docker (`localhost:8080`) e newfront servem o Angular em `/`.
 * O newfront não faz fallback SPA: /login e /vbconnection/* retornam 404 no servidor.
 * Carrega a raiz, espera o bootstrap da SPA assentar e só então navega no cliente.
 *
 * Flake observado: pushState antes de o router terminar a navegação inicial para
 * `/vbconnection/home` era sobrescrito, deixando o teste na home.
 */
export async function gotoApp(page: Page, path = '/'): Promise<void> {
  const target = normalizeAppPath(path);

  await page.route(/blip\.ai|blip-chat/, (route) => route.abort());
  await page.goto('/');
  await hideThirdPartyOverlays(page);
  await page
    .getByRole('heading', { name: /Olá! Muito bom ter você aqui novamente\.|Bem-vindo,/ })
    .first()
    .waitFor({ timeout: 30_000 });

  if (target === '/') {
    return;
  }

  const autenticado = await page
    .getByRole('heading', { name: /Bem-vindo,/ })
    .first()
    .isVisible()
    .catch(() => false);

  if (autenticado) {
    await waitForAuthenticatedShellIdle(page);
    await navigateClientOnce(page, target);
    const landed = await waitForTarget(page, target, 8_000);
    if (!landed) {
      await waitForAuthenticatedShellIdle(page);
      await navigateClientOnce(page, target);
      await page.waitForURL((url) => pathnameMatchesTarget(url.pathname, target), { timeout: 15_000 });
    }
  } else {
    await navigateClientOnce(page, target);
  }

  await hideThirdPartyOverlays(page);
}

/**
 * Espera o shell autenticado parar de navegar sozinho (bootstrap Angular).
 * Usar antes de cliques de atalho na home — `force: true` neste estado perde o (click).
 */
export async function waitForAuthenticatedShellIdle(page: Page): Promise<void> {
  await page
    .waitForURL((url) => url.pathname.includes('/vbconnection/home') || url.pathname === '/', {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await waitForPathStable(page, 250);
}

async function navigateClientOnce(page: Page, target: string): Promise<void> {
  await page.evaluate((nextPath) => {
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  }, target);
}

async function waitForTarget(page: Page, target: string, timeout: number): Promise<boolean> {
  return page
    .waitForURL((url) => pathnameMatchesTarget(url.pathname, target), { timeout })
    .then(() => true)
    .catch(() => false);
}

async function waitForPathStable(page: Page, holdMs: number): Promise<void> {
  await page.waitForFunction(
    ({ hold }) => {
      const key = '__vbGotoAppStable';
      const now = Date.now();
      const w = window as unknown as Record<string, { path: string; since: number }>;
      const cur = window.location.pathname;
      const prev = w[key];
      if (!prev || prev.path !== cur) {
        w[key] = { path: cur, since: now };
        return false;
      }
      return now - prev.since >= hold;
    },
    { hold: holdMs },
    { timeout: 15_000 },
  );
}
