import { test, expect } from '@playwright/test';
import { ContratoConsultarPage } from '../../../pages/contratoConsultarPage';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { mockApiSilence } from '../../../support/novaUxMocks';

test.describe('Consultar contratos e aditivos @novaux @contrato @consultar @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiSilence(page);
    await mockLoginApis(page);
    await seedAuthenticatedSession(page);
  });

  test('abre a consulta com filtros, pesquisar e estado vazio', async ({ page }) => {
    const consultar = new ContratoConsultarPage(page);
    await consultar.acessar();

    await expect(consultar.pesquisar()).toBeVisible();
    await expect(consultar.filtrar()).toBeVisible();
    await expect(consultar.emptyMessage()).toBeVisible();
  });
});
