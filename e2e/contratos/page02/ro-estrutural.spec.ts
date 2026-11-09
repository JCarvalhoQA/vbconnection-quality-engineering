import { test, expect } from '@playwright/test';
import { ContratoPage } from '../../../pages/contratoPage';
import { destinoEstrutural } from '../../../config/destinosEstruturais';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { installPersistGuard } from '../../../support/persistGuard';
import { autenticarMasterLive, abrirPage02DestinoLive } from '../../../support/page02LiveSession';
import {
  assertCascaMockadaPorInventario,
  assertCascaPorInventario,
  assertLinhaVeiculoEstrutural,
  assertSemPersistenciaDefinitiva,
  perfilVisualUf,
  rastrearMutacoes,
} from '../../../support/page02Structural';

const LIVE = process.env.PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE === '1';
const RO = destinoEstrutural('RO');

test.describe('PAGE-02 RO estrutura visual @contrato @page02 @ro @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    await mockLoginApis(page);
    await mockContratoCadastroApis(page, 'RO', { formSource: 'ui' });
    await seedAuthenticatedSession(page);
  });

  test('carrega RO sem TG, inspeciona veículo e descarta a linha sem persistir', async ({ page }) => {
    test.info().annotations.push({ type: 'uf', description: 'RO' });
    test.info().annotations.push({ type: 'origem-ui', description: 'LIVE_FIELD_INVENTORY.RO' });

    const contrato = new ContratoPage(page);
    const log = rastrearMutacoes(page);
    const ui = perfilVisualUf('RO');

    await contrato.acessar();
    await contrato.selecionarDestino(RO.nomeFantasia);
    await assertCascaMockadaPorInventario(page, contrato, ui);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
    await expect(contrato.submit).toBeEnabled();
  });
});

test.describe('PAGE-02 RO estrutura visual @contrato @page02 @ro @live-readonly', () => {
  test.skip(!LIVE, 'Live-readonly exige PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1 e autorização explícita.');
  test.describe.configure({ timeout: 180_000, retries: 0 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    test.info().annotations.push({ type: 'uf', description: 'RO' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('valida casca RO, ausência de TG, veículo e descarte sem Registrar', async ({ page }) => {
    const ui = perfilVisualUf('RO');
    const log = rastrearMutacoes(page);
    const capture = await autenticarMasterLive(page);
    const contrato = await abrirPage02DestinoLive(page, capture, 'RO');
    await assertCascaPorInventario(page, contrato, ui);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
  });
});
