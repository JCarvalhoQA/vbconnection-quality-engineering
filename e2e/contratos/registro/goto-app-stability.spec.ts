import { test, expect } from '@playwright/test';
import { ContratoPage } from '../../../pages/contratoPage';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';

test.describe('gotoApp estabilidade — inserir contrato @mocked', () => {
  test.describe.configure({ retries: 0, timeout: 60_000 });

  for (let i = 1; i <= 5; i += 1) {
    test(`repetição ${i}: seed + PAGE-02`, async ({ page }) => {
      annotateMockedExecution();
      await mockLoginApis(page);
      await mockContratoCadastroApis(page, 'BA');
      await seedAuthenticatedSession(page);

      const contrato = new ContratoPage(page);
      await contrato.acessar();
      await expect(page).toHaveURL(/\/vbconnection\/contrato\/inserir/);
      await expect(contrato.heading).toBeVisible();
      await expect(contrato.destino).toBeVisible();
    });
  }
});
