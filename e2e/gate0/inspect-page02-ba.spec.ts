import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { ContratoPage } from '../../pages/contratoPage';
import { detranConfig } from '../../config/detransIds';
import { installPersistGuard } from '../../support/persistGuard';
import {
  assertMasterProfile,
  AuthCapture,
  captureSanitizedPage02,
  extractDestinoUfs,
  installAuthCapture,
  installDestinosCapture,
  inventoryVisiblePage,
  requireMasterCredentials,
  summarizeAuthBody,
  writeGate0Json,
} from '../../support/liveInspect';

const GATE0 = process.env.PLAYWRIGHT_GATE0_LIVE === '1';

/**
 * Inspeção live-readonly PAGE-02 BA.
 * Sem mock de autenticação. persistGuard aborta mutações /api/, inclusive registrar.
 * Não clica em Registrar contrato.
 */
test.describe('Gate 0 — inspeção live PAGE-02 BA @live-readonly', () => {
  test.skip(!GATE0, 'Gate 0 live exige PLAYWRIGHT_GATE0_LIVE=1 e autorização explícita.');

  test.describe.configure({ timeout: 120_000, retries: 0 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('autentica Master, inspeciona destinos-combo e locators PAGE-02 BA sem persistir', async ({ page }) => {
    const credenciais = requireMasterCredentials();
    const abortados: string[] = [];
    page.on('requestfailed', (request) => {
      const failure = request.failure()?.errorText || '';
      if (/blockedbyclient|ERR_BLOCKED/i.test(failure) && /POST|PUT|PATCH|DELETE/i.test(request.method())) {
        abortados.push(`${request.method()} ${request.url()}`);
      }
    });

    const login = new LoginPage(page);
    const home = new HomePage(page);
    const contrato = new ContratoPage(page);
    const ba = detranConfig('BA');

    const capture: AuthCapture = {};
    await installAuthCapture(page, capture);

    await login.goto();
    await login.fillCredentials({
      username: credenciais.username,
      password: credenciais.password,
    });
    await login.submitLogin();
    await login.loader.waitUntilHidden();

    await expect
      .poll(() => capture.tokens?.status, { timeout: 30_000 })
      .toBeTruthy();

    const tokensResumo = summarizeAuthBody(capture.tokens?.body);
    const tokensUrl = capture.tokens?.url ? new URL(capture.tokens.url) : null;
    writeGate0Json('gate0-tokens-status.json', {
      status: capture.tokens?.status,
      origin: tokensUrl?.origin,
      path: tokensUrl?.pathname,
      resumo: tokensResumo,
    });
    if (
      capture.tokens?.status !== 200 ||
      tokensResumo.autenticaEmDuasEtapas ||
      tokensResumo.passwordExpirado ||
      !tokensResumo.hasToken
    ) {
      const erroVisivel = await login.authError().textContent().catch(() => null);
      writeGate0Json('gate0-status.json', {
        status: 'BLOQUEADO',
        motivo: 'POST /auth/tokens não estabeleceu sessão Master utilizável.',
        http: capture.tokens?.status,
        resumo: tokensResumo,
        erroVisivel,
        url: page.url(),
      });
      throw new Error(`Gate 0 bloqueado: tokens HTTP ${capture.tokens?.status} resumo=${JSON.stringify(tokensResumo)}`);
    }

    await expect
      .poll(() => capture.prefs2?.status, { timeout: 30_000 })
      .toBe(200);

    const prefsBody = capture.prefs2?.body;
    const prefsUrl = capture.prefs2?.url ? new URL(capture.prefs2.url) : null;
    writeGate0Json('gate0-prefs-meta.json', {
      status: capture.prefs2?.status,
      origin: prefsUrl?.origin,
      path: prefsUrl?.pathname,
      resumo: summarizeAuthBody(prefsBody),
    });

    const urlAposLogin = page.url();
    if (/alterar|senha|expirad|2fa|otp/i.test(urlAposLogin)) {
      writeGate0Json('gate0-status.json', {
        status: 'BLOQUEADO',
        motivo: 'Login não chegou na home (senha expirada, 2FA ou fluxo equivalente).',
        url: urlAposLogin,
      });
      throw new Error(`Gate 0 bloqueado: URL após login=${urlAposLogin}`);
    }

    const perfil = assertMasterProfile(prefsBody);
    await home.expectLoaded();
    writeGate0Json('gate0-status.json', { status: 'AUTH_OK', perfil, abortados });

    await installDestinosCapture(page, capture);
    await contrato.acessar();
    await expect.poll(() => capture.destinos, { timeout: 20_000 }).toBeTruthy();
    const destinos = capture.destinos;
    const ufs = extractDestinoUfs(destinos);
    writeGate0Json('destinos-combo.json', { perfil, ufs, destinos });

    await expect(contrato.destino).toBeVisible();
    const locatorsBase = {
      headingRegistrar: await contrato.heading.isVisible(),
      comboboxDestino: await contrato.destino.isVisible(),
      botaoRegistrar: await contrato.submit.isVisible(),
    };

    if (!ufs.includes('BA')) {
      writeGate0Json('page02-ba-locators.json', {
        perfil,
        url: page.url(),
        status: 'BLOQUEADO',
        motivo: 'BA ausente no destinos-combo live.',
        locatorsBase,
        ufs,
        abortados,
      });
      throw new Error('Gate 0 bloqueado: BA não consta no destinos-combo live.');
    }

    await contrato.selecionarDetran(ba);
    await expect(page.getByRole('heading', { name: 'Agente financeiro' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Veículos' })).toBeVisible();
    await expect(contrato.submit).toBeVisible();

    const inventory = await inventoryVisiblePage(page);
    const evidence = await captureSanitizedPage02(page, 'BA');
    writeGate0Json('page02-ba-inventory.json', inventory);
    writeGate0Json('page02-ba-locators.json', {
      perfil,
      url: page.url(),
      locatorsBase: {
        ...locatorsBase,
        headingAgente: await page.getByRole('heading', { name: 'Agente financeiro' }).isVisible(),
        headingVeiculos: await page.getByRole('heading', { name: 'Veículos' }).isVisible(),
        submitEnabled: await contrato.submit.isEnabled(),
      },
      campos: inventory.fields.length,
      headings: inventory.headings,
      evidence,
      persistencia: 'nenhum submit; persistGuard live-readonly aborta mutações /api/',
      abortados,
    });
  });
});
