import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { mockLoginApis, seedAuthenticatedSession } from '../../support/auth';
import { mockApiSilence, mockHomeApis } from '../../support/novaUxMocks';

const TOPO_ESPERADO = [
  'Início',
  'Faturamento',
  'Gerenciar Usuários',
  'Legislação',
  'vbPlay',
  'vbChat',
] as const;

test.describe('Menu lateral — ordenação Nova UX @novaux @menu @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiSilence(page);
    await mockLoginApis(page);
    await mockHomeApis(page);
    await seedAuthenticatedSession(page);
  });

  test('VA-1782 mantém a ordem do topo e abre Faturamento', async ({ page }) => {
    const home = new HomePage(page);
    await home.acessar();

    await home.menu.expectTopOrder(TOPO_ESPERADO);
    await expect(home.menu.item('vbAuto')).toBeVisible();

    await home.menu.item('Faturamento').click();
    await expect(page).toHaveURL(/\/vbconnection\/faturamento/);
    await expect(page.getByRole('heading', { name: 'Faturamento' })).toBeVisible();
  });
});
