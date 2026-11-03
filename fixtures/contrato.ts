import type { DetranUf } from '../config/detransIds';

export interface ContratoVeiculoData {
  readonly chassi: string;
  readonly zeroKm: boolean;
  readonly ano: string;
  readonly modelo: string;
}

export interface ContratoDadosData {
  readonly tipo: string;
  readonly numero: string;
  readonly data: string;
}

export interface ContratoPessoaData {
  readonly documento: string;
  readonly nome: string;
  readonly cep: string;
  readonly logradouro: string;
  readonly numero: string;
  readonly bairro: string;
  readonly uf: DetranUf;
  readonly cidade: string;
}

export interface ContratoAgenteData {
  readonly nome: string;
  readonly cnpj: string;
  readonly label: string;
}

export interface ContratoRegistroMass {
  readonly uf: DetranUf;
  readonly agente: ContratoAgenteData;
  readonly veiculo: ContratoVeiculoData;
  readonly contrato: ContratoDadosData;
  readonly devedor: ContratoPessoaData;
}

export const CONTRATO_AGENTE_PILOTO: ContratoAgenteData = {
  nome: 'Banco Piloto E2E',
  cnpj: '11222333000181',
  label: 'Banco Piloto E2E - 11222333000181',
};

export const CONTRATO_TIPO_ALIENACAO = 'Alienação Fiduciária';
