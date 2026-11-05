import { Page, Route, test } from '@playwright/test';
import { DETRAN_CONFIG, DetranUf, detranConfig } from '../config/detransIds';
import { UFS } from '../config/ufsConfig';
import { obterEnderecoPorCep, obterEnderecoPorUf } from '../factories/massaDadosFactory';
import { CONTRATO_AGENTE_PILOTO } from '../fixtures/contrato';
import {
  camposDaSecao,
  loadMatrizFixture,
  MatrizIndisponivelError,
  SECAO_ADITIVO,
  SECAO_AGENTE,
  SECAO_COMPLEMENTARES,
  SECAO_CONTRATO,
  SECAO_CREDOR,
  SECAO_DEVEDOR,
  SECAO_TERCEIRO_GARANTIDOR,
  SECAO_VEICULO,
} from './matrizLoader';
import { installPersistGuard } from './persistGuard';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
  'content-type': 'application/json',
};

const UFS_COMBO = Object.values(DETRAN_CONFIG).map((item, index) => ({
  id: item.id,
  codigo: item.uf,
  nome: item.uf,
  sigla: item.uf,
  ordem: index,
}));

const CIDADES = UFS_COMBO.map((uf) => ({
  id: uf.id * 100,
  codigo: uf.id * 100,
  nome: UFS[uf.codigo].cidade,
}));

const TIPOS_USO = [
  { codigo: 'N', nome: 'Novo' },
  { codigo: 'U', nome: 'Usado' },
];

async function fulfillJson(route: Route, body: unknown, status = 200): Promise<void> {
  if (route.request().method() === 'OPTIONS') {
    await route.fulfill({ status: 204, headers: corsHeaders });
    return;
  }

  await route.fulfill({
    status,
    headers: corsHeaders,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

function isApiRequest(url: string): boolean {
  if (url.includes('/auth/')) {
    return false;
  }

  return (
    url.includes('/api/') ||
    url.includes('vbauto.api') ||
    /\/form\//.test(url) ||
    url.includes('servicos-cliente') ||
    url.includes('contratos/')
  );
}

export function protocoloRegistro(uf: DetranUf): string {
  return `E2E-${uf}-${Date.now()}`;
}

export function annotateMockedExecution(): void {
  test.info().annotations.push({ type: 'mode', description: 'mocked' });
  test.info().annotations.push({ type: 'tag', description: '@mocked' });
}

/**
 * Mock + persistGuard. Guard fica por último (LIFO) para abortar persistência real.
 */
export async function mockContratoCadastroApis(page: Page, uf: DetranUf): Promise<string> {
  const protocolo = await mockContratoCadastroApisOnly(page, uf);
  await installPersistGuard(page, { mode: 'mocked' });
  return protocolo;
}

export async function mockContratoCadastroApisOnly(page: Page, uf: DetranUf): Promise<string> {
  if (uf === 'SE') {
    throw new MatrizIndisponivelError('SE');
  }

  const destino = detranConfig(uf);
  const matriz = loadMatrizFixture(uf);
  const protocolo = protocoloRegistro(uf);

  const destinos = Object.values(DETRAN_CONFIG)
    .filter((item) => item.uf !== 'SE')
    .map((item) => ({
      id: item.id,
      nomeFantasia: item.nomeFantasia,
      razaoSocial: item.razaoSocial,
    }));

  await page.route((url) => isApiRequest(url.toString()), async (route) => {
    const requestUrl = route.request().url();
    const method = route.request().method();

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }

    if (method === 'POST' && requestUrl.includes('contratos/registrar')) {
      await fulfillJson(route, { protocolo, status: 'RECEBIDO' });
      return;
    }

    if (method === 'POST' && requestUrl.includes('servicos-cliente/servicovigente')) {
      await fulfillJson(route, true);
      return;
    }

    if (method === 'POST' && requestUrl.includes('servicos-cliente/vigente')) {
      await fulfillJson(route, { valor: '150,00' });
      return;
    }

    if (method === 'GET' && /\/form\/detran\/\d+(\?|$)/.test(requestUrl)) {
      await fulfillJson(route, matriz.secoes);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/agenteFinanceiro/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_AGENTE));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/veiculo/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_VEICULO));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/contrato/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_CONTRATO));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/devedor/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_DEVEDOR));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/credor/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_CREDOR));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/complemento/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_COMPLEMENTARES));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/terceiroGarantidor/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_TERCEIRO_GARANTIDOR));
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/aditivo/detran/')) {
      await fulfillJson(route, camposDaSecao(matriz, SECAO_ADITIVO));
      return;
    }

    if (method === 'GET' && requestUrl.includes('fornecedores/destinos-combo')) {
      await fulfillJson(route, destinos);
      return;
    }

    if (method === 'GET' && /agentesFinanceiros(\/|$|\?)/.test(requestUrl)) {
      await fulfillJson(route, [
        {
          id: 9,
          nome: CONTRATO_AGENTE_PILOTO.nome,
          cnpj: CONTRATO_AGENTE_PILOTO.cnpj,
          codigo: 'PILOTO',
          codigos: [{ codigo: 'PILOTO', destino: { id: destino.id } }],
        },
      ]);
      return;
    }

    if (method === 'GET' && /\/ufs/i.test(requestUrl)) {
      await fulfillJson(route, UFS_COMBO);
      return;
    }

    if (method === 'GET' && /publica\/cidades\/\d+/.test(requestUrl)) {
      const ufId = Number(requestUrl.match(/publica\/cidades\/(\d+)/)?.[1]);
      const cidade = CIDADES.find((item) => item.id === ufId * 100) ?? CIDADES[0];
      await fulfillJson(route, [cidade]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('tiposContrato')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'Alienação Fiduciária' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('formasContrato')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'CDC' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('tiposGravame')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'Alienação fiduciária' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('tiposChassi')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'Normal' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('tiposEspecie')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'Automóvel' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('marcasmodelos/todos')) {
      await fulfillJson(route, [{ id: 10, marcaModelo: 'VW GOL' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('tiposCombustivelBem')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'Gasolina' }]);
      return;
    }

    if (method === 'GET' && requestUrl.includes('tiposCategoriaVeiculo')) {
      await fulfillJson(route, [{ id: 1, codigo: 1, nome: 'Particular' }]);
      return;
    }

    if (method === 'GET' && /tiposUso|indicaNovoUsado|novoUsado/i.test(requestUrl)) {
      await fulfillJson(route, TIPOS_USO);
      return;
    }

    if (method === 'GET' && /\/cep\/\d+/.test(requestUrl)) {
      const cep = requestUrl.match(/\/cep\/(\d+)/)?.[1] ?? '';
      const endereco = obterEnderecoPorCep(cep) ?? obterEnderecoPorUf(uf);
      await fulfillJson(route, {
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.uf,
      });
      return;
    }

    if (method === 'GET' && /devedores\/cnpj\//.test(requestUrl)) {
      await fulfillJson(route, null);
      return;
    }

    if (method === 'GET') {
      await fulfillJson(route, []);
      return;
    }

    await fulfillJson(route, {});
  });

  return protocolo;
}
