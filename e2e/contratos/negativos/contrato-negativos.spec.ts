import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { detranConfig } from '../../../config/detransIds';

const UF = 'BA';

test.describe('PAGE-02 negativos de contrato @contrato @negativo @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    test.info().annotations.push({ type: 'negative-class', description: 'FRONTEND_VALIDATION' });
    await mockLoginApis(page);
    await mockContratoCadastroApis(page, UF);
    await seedAuthenticatedSession(page);
  });

  test('CT-052 - deve rejeitar registro do contrato quando só o datepicker recebe Tab', async ({ page }) => {
    test.info().annotations.push({ type: 'ct', description: 'CT-052' });

    const contrato = new ContratoActions(page);
    const posts: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('contratos/registrar')) {
        posts.push(request.url());
      }
    });

    await contrato.contratoPage.acessar();
    await contrato.contratoPage.selecionarDetran(detranConfig(UF));

    const picker = page.locator('nz-date-picker#dataContrato');
    await expect(picker).toBeVisible();
    const input = picker.locator('input').first();
    await input.click();
    await input.fill('10/11/2026');
    await input.press('Tab');

    await expect(page).toHaveURL(/\/vbconnection\/contrato\/inserir/);
    await expect(contrato.contratoPage.heading).toBeVisible();
    await expect(page.getByText('Contrato registrado com sucesso.')).toHaveCount(0);
    expect(posts, 'Tab no datepicker não deve POST contratos/registrar').toEqual([]);
  });
});
