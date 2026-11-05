import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../actions/contratoActions';
import { detranConfig } from '../../config/detransIds';
import { mockLoginApis, seedAuthenticatedSession } from '../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../support/contratoCadastroMocks';
import { mockApiSilence } from '../../support/novaUxMocks';

test.describe('Acessibilidade — registro de contrato @novaux @a11y @contrato @mocked', () => {
  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    await mockApiSilence(page);
    await mockLoginApis(page);
    await mockContratoCadastroApis(page, 'BA');
    await seedAuthenticatedSession(page);
  });

  test('VA-1773 marca Número do Contrato como obrigatório para leitores de tela', async ({ page }) => {
    const contrato = new ContratoActions(page);
    await contrato.contratoPage.acessar();
    await contrato.contratoPage.selecionarDetran(detranConfig('BA'));

    await expect(page.getByRole('textbox', { name: 'Número do Contrato' })).toHaveAttribute(
      'aria-required',
      'true',
    );
    await expect(page.locator('label').filter({ hasText: 'Número do Contrato' }).getByText('*')).toBeVisible();
  });
});
