import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { mockLoginApis, seedAuthenticatedSession, NOVA_UX_SESSION_ROLES } from '../../support/auth';
import { annotateMockedExecution } from '../../support/contratoCadastroMocks';
import { mockApiSilence, mockHomeApis } from '../../support/novaUxMocks';
import { installPersistGuard } from '../../support/persistGuard';
import { gotoApp } from '../../support/navigation';

/**
 * PAGE-07/08: a NX mocked não monta o formulário nas rotas pedidas (sonda Etapa 18).
 * Este spec não declara CT-078–083 como automatizados. Garante apenas que a navegação
 * não dispara POST de upload — persistência real continua proibida.
 */
test.describe('PAGE-07/08 navegação sem persistência @imagem @excecao @mocked', () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    await mockApiSilence(page);
    await mockLoginApis(page);
    await mockHomeApis(page);
    await installPersistGuard(page, { mode: 'mocked' });
    await seedAuthenticatedSession(page, [...NOVA_UX_SESSION_ROLES, 'IMAGEM_UPLOAD']);
  });

  for (const rota of [
    '/vbconnection/registrar/imagem/tela',
    '/vbconnection/registrar/imagem/lote',
  ] as const) {
    test(`navegar ${rota} não dispara POST de upload`, async ({ page }) => {
      const posts: string[] = [];
      page.on('request', (request) => {
        if (request.method() === 'POST' && /imagem|upload|arquivo/i.test(request.url())) {
          posts.push(request.url());
        }
      });

      await gotoApp(page, rota);
      await expect(page.locator('input[type=file]')).toHaveCount(0);
      expect(posts, 'nenhum POST de imagem/upload na navegação').toEqual([]);
    });
  }

  test('atalho Imagem de Contrato permanece visível na home sem abrir upload', async ({ page }) => {
    const home = new HomePage(page);
    const posts: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && /imagem|upload|arquivo/i.test(request.url())) {
        posts.push(request.url());
      }
    });

    await home.acessar();
    const atalho = home.quickAccess('Imagem de Contrato');
    await expect(atalho).toBeVisible();
    await atalho.click();
    await expect(page.locator('input[type=file]')).toHaveCount(0);
    expect(posts).toEqual([]);
  });
});
