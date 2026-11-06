import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { ContratoPage } from '../../pages/contratoPage';
import { mockLoginApis, seedAuthenticatedSession } from '../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../support/contratoCadastroMocks';
import { mockApiSilence, mockHomeApis } from '../../support/novaUxMocks';

test.describe('Home — atalho Registro de Contrato @novaux @home @contrato @smoke @mocked', () => {
  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    await mockApiSilence(page);
    await mockLoginApis(page);
    await mockHomeApis(page);
    await mockContratoCadastroApis(page, 'BA');
    await seedAuthenticatedSession(page);
  });

  test('VA-1774 abre o formulário de registro a partir da home', async ({ page }) => {
    const home = new HomePage(page);
    const contrato = new ContratoPage(page);

    await home.acessar();
    await expect(page.getByRole('heading', { name: 'Atividades mais frequentes' })).toBeVisible();
    await home.abrirAtalho('Registro de Contrato', /\/vbconnection\/contrato\/inserir/);
    await expect(contrato.heading).toBeVisible();
    await expect(contrato.destino).toBeVisible();
  });
});
