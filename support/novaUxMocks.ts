import { Page } from '@playwright/test';
import { fulfillJson, json } from './auth';

const HOME_FATURAMENTO = {
  cicloAtual: '2026-10',
  valorAtual: 150000,
  variacaoPercentual: 8.5,
  ciclos: [
    { ciclo: '2026-05', valor: 110000 },
    { ciclo: '2026-06', valor: 118000 },
    { ciclo: '2026-07', valor: 121000 },
    { ciclo: '2026-08', valor: 130000 },
    { ciclo: '2026-09', valor: 138000 },
    { ciclo: '2026-10', valor: 150000 },
  ],
};

/**
 * Evita 401/timeout nas APIs reais do Docker e do newfront.
 * Registrar antes dos mocks específicos — no Playwright a última rota ganha.
 */
export async function mockApiSilence(page: Page): Promise<void> {
  await page.route(/\/api\//, async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await fulfillJson(route, {}, 204);
      return;
    }

    const method = route.request().method();
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      await fulfillJson(route, { content: [], totalElements: 0 });
      return;
    }

    await fulfillJson(route, []);
  });
}

export async function mockHomeApis(page: Page): Promise<void> {
  await json(page, /\/home\/contratos\/resumo/, { totalAtivos: 1247 });
  await json(page, /\/home\/contratos\/por-detran/, [
    { detran: 'DETRAN-BA', total: 420 },
    { detran: 'DETRAN-SP', total: 310 },
  ]);
  await json(page, /\/home\/usuarios\/resumo/, { ativos: 142, variacaoAbsoluta: 12 });
  await json(page, /\/home\/faturamento/, HOME_FATURAMENTO);
}

export async function mockClienteListApis(page: Page): Promise<void> {
  await json(page, /\/origens/, []);
  await json(page, /\/clientes\/resumo-status/, {
    ativos: 52,
    preCadastro: 27,
    pendentes: 0,
    inativos: 1,
  });
  await json(page, /\/clientes\/consultar/, {
    content: [
      {
        id: 80,
        nomeFantasia: 'Cliente E2E',
        cpfCnpj: '12345678000199',
        tipo: { nome: 'Financeira' },
        status: 'ATIVO',
        dataAdesao: '2026-01-10',
        origem: 'PORTAL',
      },
    ],
    totalElements: 80,
  });
}
