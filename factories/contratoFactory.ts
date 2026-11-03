import { CONTRATO_AGENTE_PILOTO, CONTRATO_TIPO_ALIENACAO, ContratoRegistroMass } from '../fixtures/contrato';
import type { DetranUf } from '../config/detransIds';
import { gerarPessoaPorUf, gerarVeiculoNovoPorUf, validarPessoa, validarVeiculo } from './massaDadosFactory';
import { formatarDataPtBr } from '../utils/dateUtils';

export class ContratoFactory {
  static registro(uf: DetranUf): ContratoRegistroMass {
    const pessoa = gerarPessoaPorUf(uf);
    const veiculo = gerarVeiculoNovoPorUf(uf);
    validarPessoa(pessoa, uf);
    validarVeiculo(veiculo, 'novo');

    const timestamp = Date.now().toString().slice(-10);
    const randomico = Math.floor(Math.random() * 90 + 10);

    return {
      uf,
      agente: CONTRATO_AGENTE_PILOTO,
      veiculo: {
        chassi: veiculo.chassi,
        zeroKm: true,
        ano: veiculo.ano,
        modelo: veiculo.modelo,
      },
      contrato: {
        tipo: CONTRATO_TIPO_ALIENACAO,
        numero: `E2E${uf}${timestamp}${randomico}`.slice(0, 20),
        data: formatarDataPtBr(new Date()),
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
      },
    };
  }
}
