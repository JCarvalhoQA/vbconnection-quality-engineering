import { test, expect } from '@playwright/test';
import { ContratoPage } from '../../../pages/contratoPage';
import { destinoEstrutural, loteEstruturalDe } from '../../../config/destinosEstruturais';
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

/**
 * Spec estrutural PAGE-02 por UF. Mocked alimenta `/form/*` pelo inventário live
 * e valida casca + `*` + veículo, sem submit persistente.
 */
export function definirTestesEstruturaisPage02(uf: string): void {
  const destino = destinoEstrutural(uf);
  const tag = uf.toLowerCase();

  test.describe(`PAGE-02 ${uf} estrutura visual @contrato @page02 @${tag} @mocked`, () => {
    test.describe.configure({ timeout: 90_000 });

    test.beforeEach(async ({ page }) => {
      annotateMockedExecution();
      await mockLoginApis(page);
      await mockContratoCadastroApis(page, uf, { formSource: 'ui' });
      await seedAuthenticatedSession(page);
    });

    test(`carrega ${uf}, inspeciona veículo e descarta a linha sem persistir`, async ({ page }) => {
      const ui = perfilVisualUf(uf);
      test.info().annotations.push({ type: 'uf', description: uf });
      test.info().annotations.push({ type: 'origem-ui', description: `LIVE_FIELD_INVENTORY.${uf}` });
      test.info().annotations.push({
        type: 'origem-java',
        description: ui.matrizJava ? 'fixtures/matriz' : 'ausente',
      });
      test.info().annotations.push({ type: 'lote', description: loteEstruturalDe(uf) });

      const contrato = new ContratoPage(page);
      const log = rastrearMutacoes(page);

      await contrato.acessar();
      await contrato.selecionarDestino(destino.nomeFantasia);
      await assertCascaMockadaPorInventario(page, contrato, ui);
      await assertLinhaVeiculoEstrutural(contrato, ui);
      await assertSemPersistenciaDefinitiva(page, contrato, log);
      await expect(contrato.submit).toBeEnabled();
    });
  });

  test.describe(`PAGE-02 ${uf} estrutura visual @contrato @page02 @${tag} @live-readonly`, () => {
    test.skip(!LIVE, 'Live-readonly exige PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1 e autorização explícita.');
    test.describe.configure({ timeout: 180_000, retries: 0 });

    test.beforeEach(async ({ page }) => {
      test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
      test.info().annotations.push({ type: 'uf', description: uf });
      test.info().annotations.push({ type: 'lote', description: loteEstruturalDe(uf) });
      await installPersistGuard(page, { mode: 'live-readonly' });
    });

    test(`valida casca ${uf}, veículo e descarte sem Registrar`, async ({ page }) => {
      const ui = perfilVisualUf(uf);
      const log = rastrearMutacoes(page);
      const capture = await autenticarMasterLive(page);
      const contrato = await abrirPage02DestinoLive(page, capture, uf);
      await assertCascaPorInventario(page, contrato, ui);
      await assertLinhaVeiculoEstrutural(contrato, ui);
      await assertSemPersistenciaDefinitiva(page, contrato, log);
    });
  });
}
