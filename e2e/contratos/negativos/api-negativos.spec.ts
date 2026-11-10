import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { detranConfig } from '../../../config/detransIds';

const UF = 'BA';

test.describe('PAGE-02 negativos de API mocked @contrato @negativo @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test('CT-053 - deve rejeitar POST registrar 500 sem sucesso de registro', async ({ page }) => {
    annotateMockedExecution();
    test.info().annotations.push({ type: 'ct', description: 'CT-053' });
    test.info().annotations.push({ type: 'negative-class', description: 'MOCKED_API_REJECTION' });

    await mockLoginApis(page);
    await mockContratoCadastroApis(page, UF, { registrarStatus: 500 });
    await seedAuthenticatedSession(page);

    const contrato = new ContratoActions(page);
    const config = detranConfig(UF);
    const mass = contrato.gerarDadosContrato(UF);

    await contrato.contratoPage.acessar();
    await contrato.contratoPage.selecionarDetran(config);
    await contrato.preencherRegistro(mass, config);
    await contrato.contratoPage.esperarRegistroSemSucesso(500);

    await expect(page.getByRole('textbox', { name: 'Número do Contrato' })).toHaveValue(mass.contrato.numero);
  });
});
