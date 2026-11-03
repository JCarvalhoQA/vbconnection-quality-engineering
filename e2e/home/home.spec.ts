import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { mockLoginApis, seedAuthenticatedSession } from '../../support/auth';
import { mockApiSilence, mockHomeApis } from '../../support/novaUxMocks';

test.describe('Home — indicadores Nova UX @novaux @home @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiSilence(page);
    await mockLoginApis(page);
    await mockHomeApis(page);
    await seedAuthenticatedSession(page);
  });

  test('VA-1732 exibe KPIs, gráficos e último acesso', async ({ page }) => {
    const home = new HomePage(page);
    await home.acessar();

    await expect(page.getByText(/Último acesso em/)).toBeVisible();
    await expect(home.kpiValue('Contratos Ativos')).toHaveText('1.247');
    await expect(home.kpiValue('Faturamento Mensal')).toContainText('R$');
    await expect(home.kpiValue('Faturamento Mensal')).toContainText('150.000');
    await expect(home.kpiCard('Faturamento Mensal')).toContainText('+8,5%');
    await expect(home.kpiValue('Tarefas pendentes')).toHaveText('38');
    await expect(home.kpiValue('Usuários Ativos')).toHaveText('142');

    await expect(page.getByRole('heading', { name: 'Faturamento Mensal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contratos por DETRAN' })).toBeVisible();
    await expect(page.getByText('Dados indisponíveis')).toHaveCount(0);
  });

  test('VA-1775 oferece atalho para pular ao conteúdo', async ({ page }) => {
    const home = new HomePage(page);
    await home.acessar();

    await expect(home.skipToContent()).toHaveAttribute('href', '#vb-main-content');
  });
});
