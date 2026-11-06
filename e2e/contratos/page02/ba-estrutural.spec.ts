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
  assertObrigatoriosVisuaisJavaBa,
  assertSecoesMinimasMockadas,
  assertSemPersistenciaDefinitiva,
  perfilVisualBa,
  rastrearMutacoes,
} from '../../../support/page02Structural';

const LIVE = process.env.PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE === '1';
const BA = destinoEstrutural('BA');

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
    await contrato.selecionarDestino(BA.nomeFantasia);
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
    const ui = perfilVisualBa();
    const log = rastrearMutacoes(page);
    const capture = await autenticarMasterLive(page);
    const contrato = await abrirPage02DestinoLive(page, capture, 'BA');
    await assertCascaPorInventario(page, contrato, ui);
    await assertLinhaVeiculoEstrutural(contrato, ui);
    await assertSemPersistenciaDefinitiva(page, contrato, log);
  });
});
