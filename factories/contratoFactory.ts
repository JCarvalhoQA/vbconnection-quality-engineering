import { CONTRATO_AGENTE_PILOTO, CONTRATO_TIPO_ALIENACAO, ContratoRegistroMass } from '../fixtures/contrato';
import type { DetranUf } from '../config/detransIds';
import { gerarPessoaPorUf, gerarVeiculoNovoPorUf, validarPessoa, validarVeiculo } from './massaDadosFactory';
import { formatarDataPtBr, somarMesesHoje } from '../utils/dateUtils';
import {
  campoObrigatorio,
  campoVisivel,
  loadMatrizFixture,
  SECAO_COMPLEMENTARES,
  SECAO_CONTRATO,
  SECAO_VEICULO,
} from '../support/matrizLoader';

export class ContratoFactory {
  static registro(uf: DetranUf): ContratoRegistroMass {
    const matriz = loadMatrizFixture(uf);
    const pessoa = gerarPessoaPorUf(uf);
    const veiculo = gerarVeiculoNovoPorUf(uf);
    validarPessoa(pessoa, uf);
    validarVeiculo(veiculo, 'novo');

    const timestamp = Date.now().toString().slice(-10);
    const randomico = Math.floor(Math.random() * 90 + 10);
    const hoje = formatarDataPtBr(new Date());
    const emDozeMeses = formatarDataPtBr(somarMesesHoje(12));

    const visivel = (secao: string, campo: string) => campoVisivel(matriz, secao, campo);
    const obrigatorio = (secao: string, campo: string) => campoObrigatorio(matriz, secao, campo);

    return {
      uf,
      agente: CONTRATO_AGENTE_PILOTO,
      veiculo: {
        chassi: veiculo.chassi,
        ...(visivel(SECAO_VEICULO, 'ANO_FABRICACAO') ? { ano: veiculo.ano } : {}),
        ...(visivel(SECAO_VEICULO, 'ANO_MODELO') ? { modelo: veiculo.modelo } : {}),
        ...(visivel(SECAO_VEICULO, 'INDICA_NOVO_USADO') ? { indicaNovoUsado: 'Novo' as const } : {}),
        ...(visivel(SECAO_VEICULO, 'NUMERO_RESTRICAO')
          ? { restricao: timestamp.slice(-8) }
          : {}),
        ...(visivel(SECAO_VEICULO, 'REMARCADO') ? { situacaoChassi: 'Normal' } : {}),
      },
      contrato: {
        ...(visivel(SECAO_CONTRATO, 'TIPO_CONTRATO') ? { tipo: CONTRATO_TIPO_ALIENACAO } : {}),
        ...(visivel(SECAO_CONTRATO, 'TIPO_RESTRICAO') ? { tipoRestricao: 'Alienação fiduciária' } : {}),
        numero: `E2E${uf}${timestamp}${randomico}`.slice(0, 20),
        ...(visivel(SECAO_CONTRATO, 'DATA_CONTRATO') ? { data: hoje } : {}),
        ...(obrigatorio(SECAO_CONTRATO, 'VALOR_TOTAL') ? { valorTotal: '15000,00' } : {}),
        ...(obrigatorio(SECAO_CONTRATO, 'VALOR_PARCELA') ? { valorParcela: '1250,00' } : {}),
        ...(obrigatorio(SECAO_CONTRATO, 'NUMERO_PARCELAS') ? { parcelas: '12' } : {}),
        ...(visivel(SECAO_CONTRATO, 'DATA_LIBERACAO_CREDITO') ? { liberacaoCredito: hoje } : {}),
        ...(visivel(SECAO_CONTRATO, 'VIGENCIA_CONTRATO')
          ? { inicioVigencia: hoje, fimVigencia: emDozeMeses }
          : {}),
        ...(visivel(SECAO_CONTRATO, 'VENCIMENTO_PRIMEIRA_PARCELA') ? { vencPrimeira: hoje } : {}),
        ...(visivel(SECAO_CONTRATO, 'VENCIMENTO_ULTIMA_PARCELA') ? { vencUltima: emDozeMeses } : {}),
        ...(obrigatorio(SECAO_COMPLEMENTARES, 'INDICE_SIGLA') ? { indice: 'IPCA' } : {}),
        ...(visivel(SECAO_CONTRATO, 'IOF_VALOR') ? { iof: '100,00' } : {}),
        ...(visivel(SECAO_CONTRATO, 'JUROS_TAXA_MENSAL') ? { jurosMes: '1,99' } : {}),
        ...(visivel(SECAO_CONTRATO, 'JUROS_TAXA_ANUAL') ? { jurosAno: '12,00' } : {}),
        ...(obrigatorio(SECAO_CONTRATO, 'PENALIDADE_DESCRICAO') ? { penalidade: 'Multa contratual' } : {}),
        ...(obrigatorio(SECAO_COMPLEMENTARES, 'MULTA_VALOR') ? { multa: '100,00' } : {}),
        ...(obrigatorio(SECAO_CONTRATO, 'DATA_PAGAMENTO') ? { dataPagamento: hoje } : {}),
      },
      devedor: {
        documento: pessoa.cpfCnpj,
        nome: pessoa.nomeCompleto.slice(0, 40),
        cep: pessoa.cep,
        logradouro: pessoa.logradouro,
        numero: pessoa.numero ?? '100',
        bairro: pessoa.bairro,
        uf,
        cidade: pessoa.cidade,
        complemento: pessoa.complemento ?? 'Casa 1',
        telefone: pessoa.telefone,
        email: pessoa.email,
      },
    };
  }
}
