import { Page } from '@playwright/test';

const LOGIN_PATHS = new Set(['/', '/login']);

export function isLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return LOGIN_PATHS.has(path) || path.startsWith('/login/');
}

export function isLoginUrl(url: URL): boolean {
  return isLoginPath(url.pathname);
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
 * Carrega a raiz e navega no cliente quando o destino não é `/`, para os dois alvos.
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

  await page.evaluate((nextPath) => {
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  }, target);
  await hideThirdPartyOverlays(page);
}

function normalizeAppPath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  if (path.startsWith('http')) {
    const url = new URL(path);
    return `${url.pathname}${url.search}` || '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
}
