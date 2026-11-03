import { test, expect } from '@playwright/test';
import { ClienteListPage } from '../../pages/clienteListPage';
import { mockLoginApis, seedAuthenticatedSession } from '../../support/auth';
import { mockApiSilence, mockClienteListApis } from '../../support/novaUxMocks';

test.describe('Cadastros — totais de clientes @novaux @cadastros @clientes @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiSilence(page);
    await mockLoginApis(page);
    await mockClienteListApis(page);
    await seedAuthenticatedSession(page);
  });

  test('VA-1816 exibe total geral e cards Ativos, Pré-cadastro, Pendentes e Inativos', async ({ page }) => {
    const clientes = new ClienteListPage(page);
    await clientes.acessar();

    await expect(clientes.subtitle()).toContainText('80 clientes cadastrados');
    await expect(clientes.metricValue('Ativos')).toHaveText('52');
    await expect(clientes.metricValue('Pré-cadastro')).toHaveText('27');
    await expect(clientes.metricValue('Pendentes')).toHaveText('0');
    await expect(clientes.metricValue('Inativos')).toHaveText('1');
    await expect(page.getByRole('button', { name: /Adicionar Cliente/ })).toBeVisible();
  });
});
