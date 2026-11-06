import todas from '../fixtures/matriz/todas.json';

export type CampoMatriz = readonly [boolean, boolean];

export type StatusCampo = 'obrigatorio' | 'opcional' | 'oculto' | 'ausente';

export interface MatrizFixture {
  readonly uf: string;
  readonly origem: string;
  readonly fonteJava: string;
  readonly fonteHash?: string;
  readonly geradoEm?: string;
  readonly idHmg: number | null;
  readonly naSuitePlaywright: boolean;
  readonly secoes: Record<string, boolean>;
  readonly campos: Record<string, Record<string, CampoMatriz>>;
}

export const SECAO_AGENTE = 'DADOS_AGENTE_FINANCEIRO';
export const SECAO_VEICULO = 'DADOS_VEICULO';
export const SECAO_CONTRATO = 'DADOS_CONTRATO';
export const SECAO_DEVEDOR = 'DADOS_DEVEDOR';
export const SECAO_CREDOR = 'DADOS_CREDOR';
export const SECAO_COMPLEMENTARES = 'DADOS_COMPLEMENTARES';
export const SECAO_TERCEIRO_GARANTIDOR = 'DADOS_TERCEIRO_GARANTIDOR';
export const SECAO_ADITIVO = 'DADOS_ADITIVO';

export class MatrizIndisponivelError extends Error {
  readonly uf: string;

  constructor(uf: string) {
    super(
      `${uf}: formularioIndisponivel — sem coluna na matriz Java e sem fixture fixtures/matriz/${uf}.json. Não mockar como DETRAN suportado.`,
    );
    this.name = 'MatrizIndisponivelError';
    this.uf = uf;
  }
}

const MATRIZ = todas as unknown as Record<string, MatrizFixture>;

export function hasMatrizFixture(uf: string): boolean {
  return Object.prototype.hasOwnProperty.call(MATRIZ, uf);
}

export function loadMatrizFixture(uf: string): MatrizFixture {
  const fixture = MATRIZ[uf];
  if (!fixture) {
    throw new MatrizIndisponivelError(uf);
  }
  return fixture;
}

export function campoCelula(fixture: MatrizFixture, secao: string, campo: string): CampoMatriz | undefined {
  return fixture.campos[secao]?.[campo];
}

export function statusCampo(fixture: MatrizFixture, secao: string, campo: string): StatusCampo {
  const celula = campoCelula(fixture, secao, campo);
  if (!celula) {
    return 'ausente';
  }
  const [visivel, obrigatorio] = celula;
  if (!visivel) {
    return 'oculto';
  }
  return obrigatorio ? 'obrigatorio' : 'opcional';
}

export function campoVisivel(fixture: MatrizFixture, secao: string, campo: string): boolean {
  return statusCampo(fixture, secao, campo) !== 'oculto' && statusCampo(fixture, secao, campo) !== 'ausente';
}

export function campoObrigatorio(fixture: MatrizFixture, secao: string, campo: string): boolean {
  return statusCampo(fixture, secao, campo) === 'obrigatorio';
}

export function secaoVisivel(fixture: MatrizFixture, secao: string): boolean {
  return Boolean(fixture.secoes[secao]);
}

export function camposDaSecao(fixture: Pick<MatrizFixture, 'campos'>, secao: string): Record<string, CampoMatriz> {
  return fixture.campos[secao] ?? {};
}
