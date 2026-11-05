import { test, expect } from '@playwright/test';
import { ContratoPage } from '../../../pages/contratoPage';
import { HomePage } from '../../../pages/homePage';
import { LoginPage } from '../../../pages/loginPage';
import { detranConfig } from '../../../config/detransIds';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import {
  assertMasterProfile,
  AuthCapture,
  extractDestinoUfs,
  installAuthCapture,
  installDestinosCapture,
  requireMasterCredentials,
  summarizeAuthBody,
} from '../../../support/liveInspect';
import { installPersistGuard } from '../../../support/persistGuard';
import {
  assertLinhaVeiculoEstrutural,
  assertObrigatoriosVisuaisJavaBa,
  assertObrigatoriosVisuaisLive,
  assertSecoes,
  assertSecoesMinimasMockadas,
  assertSemPersistenciaDefinitiva,
  perfilVisualBa,
  rastrearMutacoes,
} from '../../../support/page02Structural';

const LIVE = process.env.PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE === '1';
const BA = detranConfig('BA');

test.describe('PAGE-02 BA estrutura visual @contrato @page02 @ba @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    await mockLoginApis(page);
    await mockContratoCadastroApis(page, 'BA');
    await seedAuthenticatedSession(page);
  });

  test('carrega o formulário, inspeciona veículo e descarta a linha sem persistir', async ({ page }) => {
    test.info().annotations.push({ type: 'origem-ui', description: 'LIVE_FIELD_INVENTORY.veiculo.zeroKm' });
    test.info().annotations.push({ type: 'origem-java', description: 'fixtures/matriz/BA.json INDICA_NOVO_USADO' });

    const contrato = new ContratoPage(page);
    const log = rastrearMutacoes(page);
    const ui = perfilVisualBa();

    await contrato.acessar();
    await contrato.selecionarDetran(BA);
    await assertSecoesMinimasMockadas(page);
    await assertObrigatoriosVisuaisJavaBa(contrato);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
    await expect(contrato.submit).toBeEnabled();
  });
});

test.describe('PAGE-02 BA estrutura visual @contrato @page02 @ba @live-readonly', () => {
  test.skip(!LIVE, 'Piloto live-readonly exige PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1 e autorização explícita.');
  test.describe.configure({ timeout: 180_000, retries: 0 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('valida casca, linha de veículo, zero km e descarte sem Registrar', async ({ page }) => {
    const credenciais = requireMasterCredentials();
    const contrato = new ContratoPage(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const ui = perfilVisualBa();
    const log = rastrearMutacoes(page);
    const capture: AuthCapture = {};

    await installAuthCapture(page, capture);
    await login.goto();
    await login.fillCredentials({ username: credenciais.username, password: credenciais.password });
    await login.submitLogin();
    await login.loader.waitUntilHidden();
    await expect.poll(() => capture.tokens?.status, { timeout: 30_000 }).toBe(200);
    const tokensResumo = summarizeAuthBody(capture.tokens?.body);
    if (tokensResumo.autenticaEmDuasEtapas || tokensResumo.passwordExpirado || !tokensResumo.hasToken) {
      throw new Error(`Piloto BA bloqueado: tokens ${JSON.stringify(tokensResumo)}`);
    }
    await expect.poll(() => capture.prefs2?.status, { timeout: 30_000 }).toBe(200);
    assertMasterProfile(capture.prefs2?.body);
    await home.expectLoaded();

    await installDestinosCapture(page, capture);
    await contrato.acessar();
    await expect.poll(() => capture.destinos, { timeout: 20_000 }).toBeTruthy();
    expect(extractDestinoUfs(capture.destinos)).toContain('BA');

    await contrato.selecionarDetran(BA);
    await assertSecoes(page, ui.headings);
    await assertObrigatoriosVisuaisLive(contrato, ui);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
  });
});
