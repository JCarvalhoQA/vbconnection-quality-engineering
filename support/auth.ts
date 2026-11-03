import { Page, Route } from '@playwright/test';
import { LoginFactory } from '../factories/loginFactory';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
  'content-type': 'application/json',
};

export async function fulfillJson(route: Route, body: unknown, status = 200): Promise<void> {
  if (route.request().method() === 'OPTIONS') {
    await route.fulfill({ status: 204, headers: corsHeaders });
    return;
  }

  await route.fulfill({
    status,
    headers: corsHeaders,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function json(page: Page, url: string | RegExp, body: unknown, status = 200): Promise<void> {
  await page.route(url, async (route) => {
    await fulfillJson(route, body, status);
  });
}

export const NOVA_UX_SESSION_ROLES = [
  'ADMINISTRADOR',
  'CONTRATO',
  'CONTRATO_EDITAR',
  'CONTRATO_EXPORTAR',
  'CLIENTES',
  'RELATORIO_FATURAMENTO',
  'RELATORIO_TAXA_DETRAN',
  'IMAGEM',
  'GRAVAME',
  'ARQUIVOS_LISTA',
  'ARQUIVOS_IMG_LISTA',
  'RELATORIO',
  'ADMINISTRACAO',
  'B3',
  'SERVICO_CLIENTE',
] as const;

export function adminSession() {
  const admin = LoginFactory.credentials('admin');
  return {
    id: 1,
    nome: admin.nome ?? 'Usuario E2E',
    username: admin.username,
    email: admin.email ?? 'qa.e2e@vbtech.info',
    perfil: { id: 1, perfil: admin.perfil ?? 'ADMINISTRADOR' },
    roles: admin.roles ?? [...NOVA_UX_SESSION_ROLES],
    dataUltimoAcesso: '2026-09-24T12:00:00.000Z',
  };
}

export type LoginApiOutcome = 'success' | 'unauthorized' | 'twoFactor' | 'expired' | 'offline';

export async function mockLoginApis(page: Page, outcome: LoginApiOutcome = 'success'): Promise<void> {
  await page.route(/\/auth\/tokens$/, async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }

    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    if (outcome === 'offline') {
      await route.abort('internetdisconnected');
      return;
    }

    if (outcome === 'unauthorized') {
      await fulfillJson(route, [{ mensagem: 'Usuário ou senha inválidos' }], 401);
      return;
    }

    if (outcome === 'twoFactor') {
      const twoFactor = LoginFactory.credentials('twoFactor');
      await fulfillJson(route, {
        autenticaEmDuasEtapas: true,
        email: twoFactor.email,
      });
      return;
    }

    if (outcome === 'expired') {
      await fulfillJson(route, {
        token: 'token-senha-expirada',
        passwordExpirado: true,
        tempoDeExpiracao: 5,
      });
      return;
    }

    await fulfillJson(route, {
      token: 'e2e-token',
      tempoDeExpiracao: 30,
      frontVersion: '0.1.0',
    });
  });

  await json(page, '**/auth/prefs2', adminSession());
  await json(page, '**/auth/tokens/revoke', {});
  await json(page, '**/auth/tokens/prolongate', {});
  await json(page, '**/mensagens/qtd-nao-visualizada', { qtd: 0 });
  await json(page, '**/publica/version', {
    id: 1,
    frontendVersion: '0.1.0',
    backendVersion: '1.0.0',
  });
}

export const CONTRATO_SESSION_ROLES = NOVA_UX_SESSION_ROLES;

export async function seedAuthenticatedSession(
  page: Page,
  roles: readonly string[] = CONTRATO_SESSION_ROLES,
): Promise<void> {
  const user = {
    ...adminSession(),
    roles: [...roles],
  };
  const expiration = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await page.addInitScript(
    ({ sessionUser, sessionExpiration }) => {
      localStorage.setItem('token', JSON.stringify('e2e-token'));
      localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      localStorage.setItem('roles', JSON.stringify(sessionUser.roles));
      localStorage.setItem('expiration_token', JSON.stringify(sessionExpiration));
      localStorage.setItem('session_time', '30');
      localStorage.setItem('front_version', '0.1.0');
    },
    { sessionUser: user, sessionExpiration: expiration },
  );
}

export async function mockRecuperacaoSenha(
  page: Page,
  outcome: 'success' | 'invalidUser' = 'success',
): Promise<void> {
  await page.route('**/recuperarSenha', async (route) => {
    await fulfillJson(route, {}, outcome === 'invalidUser' ? 500 : 200);
  });
}
