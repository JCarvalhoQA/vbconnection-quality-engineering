import { test } from '@playwright/test';
import { TELAS_PADRAO_NOVA_UX } from '../../config/telasPadrao';
import { ConsultListPage } from '../../pages/consultListPage';
import { mockLoginApis, seedAuthenticatedSession } from '../../support/auth';
import { mockApiSilence } from '../../support/novaUxMocks';

test.describe('Telas Padrão Nova UX — smoke de abertura @novaux @padrao @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiSilence(page);
    await mockLoginApis(page);
    await seedAuthenticatedSession(page);
  });

  for (const tela of TELAS_PADRAO_NOVA_UX) {
    test(`${tela.jira} abre ${tela.titulo}`, async ({ page }) => {
      const lista = new ConsultListPage(page);
      await lista.abrir(tela.rota, tela.titulo);
    });
  }
});
