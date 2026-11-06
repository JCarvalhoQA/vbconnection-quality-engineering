import { test, expect } from '@playwright/test';
import { ContratoPage } from '../../../pages/contratoPage';
import { destinoEstrutural } from '../../../config/destinosEstruturais';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { installPersistGuard } from '../../../support/persistGuard';
import { autenticarMasterLive, abrirPage02DestinoLive } from '../../../support/page02LiveSession';
import {
  assertCascaPorInventario,
  assertLinhaVeiculoEstrutural,
  assertSecoesMinimasMockadas,
  assertSemPersistenciaDefinitiva,
  assertTerceiroGarantidor,
  perfilVisualUf,
  rastrearMutacoes,
} from '../../../support/page02Structural';

const LIVE = process.env.PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE === '1';
const CE = destinoEstrutural('CE');

test.describe('PAGE-02 CE estrutura visual @contrato @page02 @ce @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    await mockLoginApis(page);
    await mockContratoCadastroApis(page, 'CE');
    await seedAuthenticatedSession(page);
  });

  test('carrega CE, TG, veículo e descarta a linha sem persistir', async ({ page }) => {
    test.info().annotations.push({ type: 'uf', description: 'CE' });
    test.info().annotations.push({ type: 'origem-ui', description: 'LIVE_FIELD_INVENTORY.CE' });

    const contrato = new ContratoPage(page);
    const log = rastrearMutacoes(page);
    const ui = perfilVisualUf('CE');

    await contrato.acessar();
    await contrato.selecionarDestino(CE.nomeFantasia);
    await assertSecoesMinimasMockadas(page);
    await assertTerceiroGarantidor(page, contrato, ui);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
    await expect(contrato.submit).toBeEnabled();
  });
});

test.describe('PAGE-02 CE estrutura visual @contrato @page02 @ce @live-readonly', () => {
  test.skip(!LIVE, 'Live-readonly exige PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1 e autorização explícita.');
  test.describe.configure({ timeout: 180_000, retries: 0 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    test.info().annotations.push({ type: 'uf', description: 'CE' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('valida casca CE, TG, juros, veículo e descarte sem Registrar', async ({ page }) => {
    const ui = perfilVisualUf('CE');
    const log = rastrearMutacoes(page);
    const capture = await autenticarMasterLive(page);
    const contrato = await abrirPage02DestinoLive(page, capture, 'CE');
    await assertCascaPorInventario(page, contrato, ui);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
  });
});
