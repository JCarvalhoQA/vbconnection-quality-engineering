import {
  CampoMatriz,
  SECAO_ADITIVO,
  SECAO_AGENTE,
  SECAO_COMPLEMENTARES,
  SECAO_CONTRATO,
  SECAO_CREDOR,
  SECAO_DEVEDOR,
  SECAO_TERCEIRO_GARANTIDOR,
  SECAO_VEICULO,
} from './matrizLoader';
import { loadUfUiProfile, UfUiProfile } from './ufUiProfile';

/**
 * Payload de `/form/*` derivado do inventário live — não é fixture Java.
 * Usado só quando a UF tem formulário UI e não existe `fixtures/matriz/{UF}.json`.
 */
export interface UiFormMock {
  readonly uf: string;
  readonly origem: 'LIVE_FIELD_INVENTORY';
  readonly fonteJava: 'ausente';
  readonly secoes: Record<string, boolean>;
  readonly campos: Record<string, Record<string, CampoMatriz>>;
}

const SECAO_POR_HEADING: Record<string, string> = {
  'Agente financeiro': SECAO_AGENTE,
  Veículos: SECAO_VEICULO,
  Contrato: SECAO_CONTRATO,
  Devedor: SECAO_DEVEDOR,
  Credor: SECAO_CREDOR,
  'Dados complementares': SECAO_COMPLEMENTARES,
  'Terceiro garantidor': SECAO_TERCEIRO_GARANTIDOR,
};

const CAMPO_POR_ID: Record<string, readonly [string, string]> = {
  codigoAgenteFinanceiro: [SECAO_AGENTE, 'CODIGO_DETRAN'],
  nomeAgenteFinanceiro: [SECAO_AGENTE, 'NOME'],
  cnpjAgenteFinanceiro: [SECAO_AGENTE, 'NUMERO_DOCUMENTO'],
  tipoContrato: [SECAO_CONTRATO, 'TIPO_CONTRATO'],
  formaContrato: [SECAO_CONTRATO, 'FORMA_CONTRATO'],
  tipoGravame: [SECAO_CONTRATO, 'TIPO_RESTRICAO'],
  numeroContrato: [SECAO_CONTRATO, 'NUMERO'],
  registroContrato: [SECAO_CONTRATO, 'NUMERO_REGISTRO'],
  registroSIRCOF: [SECAO_CONTRATO, 'NO_REGISTRO_CONTRATO_SIRCOF'],
  dataContrato: [SECAO_CONTRATO, 'DATA_CONTRATO'],
  liberacaoCredito: [SECAO_CONTRATO, 'DATA_LIBERACAO_CREDITO'],
  inicioVigencia: [SECAO_CONTRATO, 'VIGENCIA_CONTRATO'],
  finalVigencia: [SECAO_CONTRATO, 'VIGENCIA_CONTRATO'],
  parcelas: [SECAO_CONTRATO, 'NUMERO_PARCELAS'],
  parcela: [SECAO_CONTRATO, 'VALOR_PARCELA'],
  primeiraParcela: [SECAO_CONTRATO, 'VENCIMENTO_PRIMEIRA_PARCELA'],
  ultimaParcela: [SECAO_CONTRATO, 'VENCIMENTO_ULTIMA_PARCELA'],
  iof: [SECAO_CONTRATO, 'IOF_VALOR'],
  totalFinanciamento: [SECAO_CONTRATO, 'VALOR_TOTAL'],
  comissao: [SECAO_CONTRATO, 'COMISSAO_VALOR'],
  penalidade: [SECAO_CONTRATO, 'PENALIDADE_DESCRICAO'],
  taxaJurosMes: [SECAO_CONTRATO, 'JUROS_TAXA_MENSAL'],
  taxaJurosAno: [SECAO_CONTRATO, 'JUROS_TAXA_ANUAL'],
  ufLiberacaoCredito: [SECAO_CONTRATO, 'UF_LIBERACAO_CREDITO'],
  cidadeLiberacaoCredito: [SECAO_CONTRATO, 'MUNICIPIO_LIBERACAO_CREDITO'],
  ufLocalPagamento: [SECAO_CONTRATO, 'UF_LOCAL_PAGAMENTO'],
  cidadeLocalPagamento: [SECAO_CONTRATO, 'MUNICIPIO_LOCAL_PAGAMENTO'],
  emailContrato: [SECAO_CONTRATO, 'EMAIL_CONTRATO'],
  dataCadastro: [SECAO_CONTRATO, 'DATA_CADASTRO'],
  dataPagamento: [SECAO_CONTRATO, 'DATA_PAGAMENTO'],
  epocaPagamento: [SECAO_CONTRATO, 'EPOCA_PAGAMENTO'],
  devedorCnpj: [SECAO_DEVEDOR, 'NUMERO_DOCUMENTO'],
  devedorNome: [SECAO_DEVEDOR, 'NOME'],
  devedorCep: [SECAO_DEVEDOR, 'END_CEP'],
  devedorLogradouro: [SECAO_DEVEDOR, 'END_LOGRADOURO'],
  devedorNumero: [SECAO_DEVEDOR, 'END_NUMERO'],
  devedorComplemento: [SECAO_DEVEDOR, 'END_COMPLEMENTO'],
  devedorBairro: [SECAO_DEVEDOR, 'END_BAIRRO'],
  devedorUf: [SECAO_DEVEDOR, 'END_UF'],
  devedorCidade: [SECAO_DEVEDOR, 'END_MUNICIPIO'],
  devedorTelefone: [SECAO_DEVEDOR, 'TEL_NUMERO'],
  devedorCelular: [SECAO_DEVEDOR, 'CEL_NUMERO'],
  devedorEmail: [SECAO_DEVEDOR, 'EMAIL'],
  credorCep: [SECAO_CREDOR, 'END_CEP'],
  credorLogradouro: [SECAO_CREDOR, 'END_LOGRADOURO'],
  credorNumero: [SECAO_CREDOR, 'END_NUMERO'],
  credorComplemento: [SECAO_CREDOR, 'END_COMPLEMENTO'],
  credorBairro: [SECAO_CREDOR, 'END_BAIRRO'],
  credorUf: [SECAO_CREDOR, 'END_UF'],
  credorCidade: [SECAO_CREDOR, 'END_MUNICIPIO'],
  credorTelefone: [SECAO_CREDOR, 'TEL_NUMERO'],
  credorEmail: [SECAO_CREDOR, 'EMAIL'],
  cotaConsorcio: [SECAO_COMPLEMENTARES, 'NUMERO_COTA_CONSORCIO'],
  grupoConsorcio: [SECAO_COMPLEMENTARES, 'NUMERO_GRUPO_CONSORCIO'],
  indiceComplementar: [SECAO_COMPLEMENTARES, 'INDICE'],
  taxaMora: [SECAO_COMPLEMENTARES, 'TAXA_MORA'],
  taxaMulta: [SECAO_COMPLEMENTARES, 'TAXA_MULTA'],
  taxaContrato: [SECAO_COMPLEMENTARES, 'VALOR_TAXA_CONTRATO'],
  totalTaxaAdmin: [SECAO_COMPLEMENTARES, 'TAXA_ADMINISTRATIVA'],
  correcaoMonetaria: [SECAO_COMPLEMENTARES, 'CORRECAO_MONETARIA'],
  terceiroCodigo: [SECAO_TERCEIRO_GARANTIDOR, 'CODIGO_DETRAN'],
  terceiroCnpj: [SECAO_TERCEIRO_GARANTIDOR, 'NUMERO_DOCUMENTO'],
  terceiroNome: [SECAO_TERCEIRO_GARANTIDOR, 'NOME'],
  terceiroCep: [SECAO_TERCEIRO_GARANTIDOR, 'END_CEP'],
  terceiroLogradouro: [SECAO_TERCEIRO_GARANTIDOR, 'END_LOGRADOURO'],
  terceiroNumero: [SECAO_TERCEIRO_GARANTIDOR, 'END_NUMERO'],
  terceiroComplemento: [SECAO_TERCEIRO_GARANTIDOR, 'END_COMPLEMENTO'],
  terceiroBairro: [SECAO_TERCEIRO_GARANTIDOR, 'END_BAIRRO'],
  terceiroUf: [SECAO_TERCEIRO_GARANTIDOR, 'END_UF'],
  terceiroCidade: [SECAO_TERCEIRO_GARANTIDOR, 'END_MUNICIPIO'],
  terceiroTelefone: [SECAO_TERCEIRO_GARANTIDOR, 'TEL_NUMERO'],
  terceiroCelular: [SECAO_TERCEIRO_GARANTIDOR, 'TEL_CELULAR'],
};

const VEICULO_POR_CONTROL: Record<string, string> = {
  chassi: 'NUMERO_CHASSI',
  tipoChassi: 'REMARCADO',
  restricao: 'NUMERO_RESTRICAO',
  ano: 'ANO_FABRICACAO',
  modelo: 'ANO_MODELO',
  tipoEspecie: 'TIPO_ESPECIE',
  idMarcaModelo: 'MARCA',
  marcaBem: 'MARCA_BEM',
  modeloBem: 'MODELO_BEM',
  versaoModeloBem: 'VERSAO_MODELO_BEM',
  tipoCombustivelBem: 'TIPO_COMBUSTIVEL_BEM',
  tipoCategoriaVeiculo: 'TIPO_CATEGORIA_VEICULO',
  descricaoCorVeiculo: 'DESCRICAO_COR_VEICULO',
  ufLicenciamento: 'UF_LICENCIAMENTO',
  placa: 'PLACA',
  renavam: 'RENAVAM',
  uf: 'PLACA_UF',
  numeroMotor: 'NUMERO_MOTOR',
};

function celula(visivel: boolean, obrigatorio: boolean): CampoMatriz {
  return [visivel, visivel && obrigatorio];
}

function setCampo(
  campos: Record<string, Record<string, CampoMatriz>>,
  secao: string,
  campo: string,
  visivel: boolean,
  obrigatorio: boolean,
): void {
  if (!campos[secao]) {
    campos[secao] = {};
  }
  const atual = campos[secao][campo];
  if (!atual) {
    campos[secao][campo] = celula(visivel, obrigatorio);
    return;
  }
  campos[secao][campo] = celula(atual[0] || visivel, atual[1] || obrigatorio);
}

export function formMockFromUiProfile(profile: UfUiProfile): UiFormMock {
  if (!profile.formularioDisponivel) {
    throw new Error(`${profile.uf}: inventário live sem formulário — não gerar mock de /form.`);
  }

  const secoes: Record<string, boolean> = {
    [SECAO_AGENTE]: false,
    [SECAO_VEICULO]: false,
    [SECAO_CONTRATO]: false,
    [SECAO_DEVEDOR]: false,
    [SECAO_CREDOR]: profile.credor,
    [SECAO_COMPLEMENTARES]: false,
    [SECAO_TERCEIRO_GARANTIDOR]: profile.terceiroGarantidor.visivel,
    [SECAO_ADITIVO]: false,
  };
  for (const heading of profile.headings) {
    const secao = SECAO_POR_HEADING[heading];
    if (secao) {
      secoes[secao] = true;
    }
  }

  const campos: Record<string, Record<string, CampoMatriz>> = {};
  for (const secao of Object.keys(secoes)) {
    campos[secao] = {};
  }

  for (const field of profile.fields) {
    if (!field.id || !CAMPO_POR_ID[field.id]) {
      continue;
    }
    const [secao, campo] = CAMPO_POR_ID[field.id];
    setCampo(campos, secao, campo, true, field.requiredVisual);
  }

  setCampo(campos, SECAO_VEICULO, 'LISTA_VEICULOS', secoes[SECAO_VEICULO], false);
  setCampo(
    campos,
    SECAO_VEICULO,
    'INDICA_NOVO_USADO',
    profile.veiculo.novoUsado.visivel,
    profile.veiculo.novoUsado.obrigatorioVisual,
  );

  const veiculoCampos = [
    ...profile.veiculo.camposZeroKmSim,
    ...profile.veiculo.camposCondicionaisNaoZeroKm,
  ];
  for (const campo of veiculoCampos) {
    const java = VEICULO_POR_CONTROL[campo.formControl];
    if (!java) {
      continue;
    }
    setCampo(campos, SECAO_VEICULO, java, true, campo.requiredVisual);
  }

  return {
    uf: profile.uf,
    origem: 'LIVE_FIELD_INVENTORY',
    fonteJava: 'ausente',
    secoes,
    campos,
  };
}

export function formMockFromUf(uf: string): UiFormMock {
  return formMockFromUiProfile(loadUfUiProfile(uf));
}
