import { Page, Route } from '@playwright/test';
import { DETRAN_CONFIG, DetranUf, detranConfig } from '../config/detransIds';
import { UFS } from '../config/ufsConfig';
import { obterEnderecoPorCep, obterEnderecoPorUf } from '../factories/massaDadosFactory';
import { CONTRATO_AGENTE_PILOTO } from '../fixtures/contrato';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
  'content-type': 'application/json',
};

function requiredCampo(): unknown[] {
  return [true, true];
}

function optionalCampo(): unknown[] {
  return [true, false];
}

function hiddenCampo(): unknown[] {
  return [false, false];
}

const ETAPAS_REGISTRO = {
  DADOS_AGENTE_FINANCEIRO: true,
  DADOS_VEICULO: true,
  DADOS_CONTRATO: true,
  DADOS_DEVEDOR: true,
  DADOS_CREDOR: true,
  DADOS_COMPLEMENTARES: true,
};

const CAMPOS_AGENTE = {
  NOME: requiredCampo(),
  NUMERO_DOCUMENTO: optionalCampo(),
  CODIGO_DETRAN: optionalCampo(),
};

const CAMPOS_VEICULO = {
  NUMERO_CHASSI: requiredCampo(),
  REMARCADO: optionalCampo(),
  NUMERO_RESTRICAO: optionalCampo(),
  PLACA_UF: optionalCampo(),
  PLACA: optionalCampo(),
  RENAVAM: optionalCampo(),
  ANO_FABRICACAO: optionalCampo(),
  ANO_MODELO: optionalCampo(),
  TIPO_ESPECIE: optionalCampo(),
  MARCA: optionalCampo(),
  INDICA_NOVO_USADO: optionalCampo(),
  LISTA_VEICULOS: optionalCampo(),
};

const CAMPOS_CONTRATO = {
  TIPO_CONTRATO: requiredCampo(),
  FORMA_CONTRATO: optionalCampo(),
  TIPO_RESTRICAO: optionalCampo(),
  NUMERO: requiredCampo(),
  DATA_CONTRATO: requiredCampo(),
  NUMERO_PARCELAS: optionalCampo(),
  VALOR_TOTAL: optionalCampo(),
};

const CAMPOS_DEVEDOR = {
  NUMERO_DOCUMENTO: requiredCampo(),
  NOME: requiredCampo(),
  EMAIL: optionalCampo(),
  END_CEP: requiredCampo(),
  END_LOGRADOURO: requiredCampo(),
  END_NUMERO: requiredCampo(),
  END_BAIRRO: requiredCampo(),
  END_UF: requiredCampo(),
  END_MUNICIPIO: requiredCampo(),
};

const CAMPOS_CREDOR = {
  EMAIL: optionalCampo(),
  END_CEP: hiddenCampo(),
  END_LOGRADOURO: hiddenCampo(),
  END_NUMERO: hiddenCampo(),
  END_COMPLEMENTO: hiddenCampo(),
  END_BAIRRO: hiddenCampo(),
  END_UF: hiddenCampo(),
  END_MUNICIPIO: hiddenCampo(),
  TEL_NUMERO: hiddenCampo(),
};

const CAMPOS_COMPLEMENTO = {
  NUMERO_COTA_CONSORCIO: hiddenCampo(),
  GRUPO_CONSORCIO: hiddenCampo(),
  INDICE_SIGLA: hiddenCampo(),
  MORA_TAXA: optionalCampo(),
  MORA_VALOR: optionalCampo(),
  MULTA_TAXA: optionalCampo(),
  MULTA_VALOR: optionalCampo(),
  VALOR_TAXA_CONTRATO: hiddenCampo(),
  CORRECAO_MONETARIA: hiddenCampo(),
  NUMERO_CND: hiddenCampo(),
  OPCAO_COMPRA: hiddenCampo(),
  VALOR_TAC: hiddenCampo(),
  TOTAL_TAXA_ADMIN: hiddenCampo(),
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

export async function mockContratoCadastroApis(page: Page, uf: DetranUf): Promise<string> {
  const destino = detranConfig(uf);
  const protocolo = protocoloRegistro(uf);

  const destinos = Object.values(DETRAN_CONFIG).map((item) => ({
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
      await fulfillJson(route, ETAPAS_REGISTRO);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/agenteFinanceiro/detran/')) {
      await fulfillJson(route, CAMPOS_AGENTE);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/veiculo/detran/')) {
      await fulfillJson(route, CAMPOS_VEICULO);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/contrato/detran/')) {
      await fulfillJson(route, CAMPOS_CONTRATO);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/devedor/detran/')) {
      await fulfillJson(route, CAMPOS_DEVEDOR);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/credor/detran/')) {
      await fulfillJson(route, CAMPOS_CREDOR);
      return;
    }

    if (method === 'GET' && requestUrl.includes('form/complemento/detran/')) {
      await fulfillJson(route, CAMPOS_COMPLEMENTO);
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

    if (method === 'GET' && requestUrl.includes('publica/ufs/todos')) {
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
