import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { detranConfig } from '../../../config/detransIds';

/**
 * Instâncias de CT-053: rejeição HTTP do POST registrar sem copy inventada.
 * 500 permanece em api-negativos.spec.ts. Aqui 400 e 503 — mesmo oráculo de ausência de sucesso.
 */
const UF = 'BA';

test.describe('PAGE-02 exceções HTTP mocked @contrato @funcional @excecao @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  for (const status of [400, 503] as const) {
    test(`CT-053 - deve rejeitar POST registrar ${status} sem sucesso de registro`, async ({ page }) => {
      annotateMockedExecution();
      test.info().annotations.push({ type: 'ct', description: 'CT-053' });
      test.info().annotations.push({ type: 'negative-class', description: 'MOCKED_API_REJECTION' });
      test.info().annotations.push({ type: 'prioridade', description: 'P0' });

      await mockLoginApis(page);
      await mockContratoCadastroApis(page, UF, { registrarStatus: status });
      await seedAuthenticatedSession(page);

      const contrato = new ContratoActions(page);
      const config = detranConfig(UF);
      const mass = contrato.gerarDadosContrato(UF);

      await contrato.contratoPage.acessar();
      await contrato.contratoPage.selecionarDetran(config);
      await contrato.preencherRegistro(mass, config);
      await contrato.contratoPage.esperarRegistroSemSucesso(status);

      await expect(page.getByRole('textbox', { name: 'Número do Contrato' })).toHaveValue(mass.contrato.numero);
    });
  }
});
