import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { detranConfig } from '../../../config/detransIds';

/**
 * CT-047 — Confluence CT007 / DETRAN-BA.
 * Não replica as 18 UFs do flow de registro: afirma payload do POST interceptado em BA.
 */
test.describe('PAGE-02 funcionais positivos @contrato @funcional @positivo @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test('CT-047 - deve enviar POST registrar com chassi e número e exibir sucesso mocked', async ({ page }) => {
    annotateMockedExecution();
    test.info().annotations.push({ type: 'ct', description: 'CT-047' });
    test.info().annotations.push({
      type: 'confluence',
      description: 'https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2088435715',
    });
    test.info().annotations.push({ type: 'prioridade', description: 'P0' });

    await mockLoginApis(page);
    const protocolo = await mockContratoCadastroApis(page, 'BA');
    await seedAuthenticatedSession(page);

    const contrato = new ContratoActions(page);
    const mass = await contrato.registrarContratoComPayload('BA', detranConfig('BA'), protocolo);

    expect(mass.veiculo.chassi).toHaveLength(17);
    expect(mass.contrato.numero).toMatch(/^E2EBA/);
    await expect(page.getByText('Contrato registrado com sucesso.')).toBeVisible();
  });
});
