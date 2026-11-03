import { CEP_PREFIXOS_POR_UF, DDD_POR_UF, UFS, type EnderecoUf } from '../config/ufsConfig';
import { normalizarUf } from '../config/detransConfig';

const NOMES = [
  'Ana',
  'Bruno',
  'Carla',
  'Daniel',
  'Eduardo',
  'Fernanda',
  'Gustavo',
  'Helena',
  'Igor',
  'Juliana',
  'Lucas',
  'Marina',
  'Nicolas',
  'Patricia',
  'Rafael',
  'Sofia',
];
const SOBRENOMES = [
  'Almeida',
  'Barbosa',
  'Cardoso',
  'Dias',
  'Ferreira',
  'Gomes',
  'Lima',
  'Martins',
  'Oliveira',
  'Pereira',
  'Ribeiro',
  'Santos',
  'Silva',
  'Souza',
];

const usados = new Set<string>();
let sequencialPessoa = 0;

const TRANSLITERACAO_CHASSI: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
};

export interface EnderecoMassa extends EnderecoUf {
  uf: string;
  numero?: string;
  complemento?: string;
}

export interface PessoaMassa extends EnderecoMassa {
  cpfCnpj: string;
  nomeCompleto: string;
  telefone: string;
  email: string;
}

export interface VeiculoNovoMassa {
  chassi: string;
  ano: string;
  modelo: string;
  gravame: string;
  cor: string;
}

export interface VeiculoUsadoMassa extends VeiculoNovoMassa {
  renavam: string;
  placa: string;
  ufPlaca: string;
}

function somenteDigitos(valor: string): string {
  return String(valor || '').replace(/\D/g, '');
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcularDigitoCpf(cpfParcial: string): number {
  let soma = 0;
  for (let i = 0; i < cpfParcial.length; i += 1) {
    soma += Number(cpfParcial[i]) * (cpfParcial.length + 1 - i);
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function gerarCpfValido(): string {
  const base = Array.from({ length: 9 }, () => random(0, 9)).join('');
  const digito1 = calcularDigitoCpf(base);
  const digito2 = calcularDigitoCpf(`${base}${digito1}`);
  return `${base}${digito1}${digito2}`;
}

function gerarValorUnico(
  prefixo: string,
  tamanho: number,
  caracteres = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ',
): string {
  for (let tentativa = 0; tentativa < 20; tentativa += 1) {
    const semente = `${prefixo}${Date.now().toString(36)}${random(100000, 999999)}${tentativa}`.toUpperCase();
    const valor = semente
      .replace(/[^0-9A-Z]/g, '')
      .split('')
      .map((caracter) =>
        caracteres.includes(caracter) ? caracter : caracteres[random(0, caracteres.length - 1)],
      )
      .join('')
      .padEnd(tamanho, caracteres[random(0, caracteres.length - 1)])
      .slice(0, tamanho);

    if (!usados.has(valor)) {
      usados.add(valor);
      return valor;
    }
  }

  throw new Error(`Nao foi possivel gerar valor unico para ${prefixo}`);
}

function calcularDigitoChassi(chassiSemDigito: string): string {
  const pesos = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const soma = chassiSemDigito.split('').reduce((total, caracter, indice) => {
    const valor = /\d/.test(caracter) ? Number(caracter) : TRANSLITERACAO_CHASSI[caracter];
    return total + valor * pesos[indice];
  }, 0);
  const resto = soma % 11;
  return resto === 10 ? 'X' : String(resto);
}

function gerarChassiUnico(ufOuDetran: string): string {
  const uf = normalizarUf(ufOuDetran);
  const caracteres = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';

  for (let tentativa = 0; tentativa < 20; tentativa += 1) {
    const base = gerarValorUnico(`9BW${uf}`, 17, caracteres).split('');
    base[8] = calcularDigitoChassi(base.join(''));
    const chassi = base.join('');
    if (!usados.has(chassi)) {
      usados.add(chassi);
      return chassi;
    }
  }

  throw new Error(`Nao foi possivel gerar chassi unico para ${uf}`);
}

function gerarGravameUnico(): string {
  return gerarValorUnico('GRV', 13, '0123456789');
}

function gerarRenavamUnico(): string {
  for (let tentativa = 0; tentativa < 20; tentativa += 1) {
    const base = gerarValorUnico('', 10, '0123456789').padStart(10, '0');
    const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split('').reduce((total, digito, indice) => total + Number(digito) * pesos[indice], 0);
    const resto = soma % 11;
    const digito = resto < 2 ? 0 : 11 - resto;
    const renavam = `${base}${digito}`;
    if (!usados.has(renavam)) {
      usados.add(renavam);
      return renavam;
    }
  }

  throw new Error('Nao foi possivel gerar RENAVAM unico');
}

function gerarPlacaUnica(): string {
  const letras = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const placa = [
    letras[random(0, letras.length - 1)],
    letras[random(0, letras.length - 1)],
    letras[random(0, letras.length - 1)],
    random(0, 9),
    letras[random(0, letras.length - 1)],
    random(0, 9),
    random(0, 9),
  ].join('');

  if (usados.has(placa)) {
    return gerarPlacaUnica();
  }

  usados.add(placa);
  return placa;
}

function gerarTelefone(uf: string): string {
  return `${DDD_POR_UF[uf] || '11'}9${random(10000000, 99999999)}`;
}

function gerarNomeUnico(): string {
  for (let tentativa = 0; tentativa < 100; tentativa += 1) {
    const indice = sequencialPessoa + tentativa;
    const nomeCompleto = [
      NOMES[indice % NOMES.length],
      SOBRENOMES[Math.floor(indice / NOMES.length) % SOBRENOMES.length],
      SOBRENOMES[Math.floor(indice / (NOMES.length * SOBRENOMES.length)) % SOBRENOMES.length],
    ].join(' ');

    if (!usados.has(nomeCompleto)) {
      sequencialPessoa = indice + 1;
      return nomeCompleto;
    }
  }

  throw new Error('Não foi possível gerar nome único para a massa de teste');
}

export function validarCepPorUf(cep: string, uf: string): void {
  const cepLimpo = somenteDigitos(cep);
  const prefixos = CEP_PREFIXOS_POR_UF[uf];
  if (!prefixos) {
    throw new Error(`UF sem configuração de CEP: ${uf}`);
  }
  if (!prefixos.some((prefixo) => cepLimpo.startsWith(prefixo))) {
    throw new Error(`CEP ${cep} não é compatível com a UF ${uf}`);
  }
}

export function validarEndereco(endereco: EnderecoMassa, uf: string): void {
  const camposObrigatorios: Array<keyof EnderecoMassa> = ['cep', 'logradouro', 'bairro', 'cidade', 'uf'];
  const campoVazio = camposObrigatorios.find((campo) => !endereco[campo]);
  if (campoVazio) {
    throw new Error(`Endereço da UF ${uf} sem campo obrigatório: ${String(campoVazio)}`);
  }
  if (endereco.uf !== uf) {
    throw new Error(`Endereço com UF ${endereco.uf}, esperado ${uf}`);
  }
  validarCepPorUf(endereco.cep, uf);
}

export function validarPessoa(pessoa: PessoaMassa, uf: string): void {
  const camposObrigatorios: Array<keyof PessoaMassa> = ['cpfCnpj', 'nomeCompleto', 'telefone', 'email'];
  const campoVazio = camposObrigatorios.find((campo) => !pessoa[campo]);
  if (campoVazio) {
    throw new Error(`Pessoa da UF ${uf} sem campo obrigatorio: ${String(campoVazio)}`);
  }
  validarEndereco(pessoa, uf);
}

export function validarVeiculo(veiculo: VeiculoNovoMassa | VeiculoUsadoMassa, tipo = 'novo'): void {
  const camposObrigatorios: Array<keyof VeiculoNovoMassa> = ['chassi', 'ano', 'modelo', 'gravame'];
  const campoVazio = camposObrigatorios.find((campo) => !veiculo[campo]);
  if (campoVazio) {
    throw new Error(`Veiculo sem campo obrigatorio: ${String(campoVazio)}`);
  }
  if (!/^[0-9A-HJ-NPR-Z]{17}$/.test(veiculo.chassi)) {
    throw new Error(`Chassi invalido para teste: ${veiculo.chassi}`);
  }
  if (tipo === 'usado') {
    const usado = veiculo as VeiculoUsadoMassa;
    const camposUsado: Array<keyof VeiculoUsadoMassa> = ['renavam', 'placa', 'ufPlaca'];
    const campoUsadoVazio = camposUsado.find((campo) => !usado[campo]);
    if (campoUsadoVazio) {
      throw new Error(`Veiculo usado sem campo obrigatorio: ${String(campoUsadoVazio)}`);
    }
  }
}

export function obterEnderecoPorUf(ufOuDetran: string): EnderecoMassa {
  const uf = normalizarUf(ufOuDetran);
  const endereco = UFS[uf];
  if (!endereco) {
    throw new Error(`Não existe endereço configurado para a UF ${uf}`);
  }
  const completo = { ...endereco, uf };
  validarEndereco(completo, uf);
  return completo;
}

export function obterEnderecoPorCep(cep: string): EnderecoMassa | undefined {
  const cepLimpo = somenteDigitos(cep);
  const entrada = Object.entries(UFS).find(([, endereco]) => somenteDigitos(endereco.cep) === cepLimpo);
  if (!entrada) {
    return undefined;
  }
  return { ...entrada[1], uf: entrada[0] };
}

export function gerarPessoaPorUf(ufOuDetran: string): PessoaMassa {
  const uf = normalizarUf(ufOuDetran);
  const baseEndereco = UFS[uf];
  if (!baseEndereco) {
    throw new Error(`Não existe massa configurada para a UF ${uf}`);
  }

  for (let tentativa = 0; tentativa < 10; tentativa += 1) {
    const sufixo = `${Date.now()}${random(1000, 9999)}${tentativa}`;
    const nomeCompleto = gerarNomeUnico();
    const cpfCnpj = gerarCpfValido();
    const numero = String(random(10, 9999));
    const email = `teste.${uf.toLowerCase()}.${sufixo}@vbauto.test`;
    const telefone = gerarTelefone(uf);
    const endereco: EnderecoMassa = {
      cep: baseEndereco.cep,
      logradouro: baseEndereco.logradouro,
      bairro: baseEndereco.bairro,
      cidade: baseEndereco.cidade,
      estado: baseEndereco.estado,
      uf,
      numero,
      complemento: `Compl ${random(1, 99)}`,
    };

    validarEndereco(endereco, uf);

    const chaves = [
      cpfCnpj,
      nomeCompleto,
      telefone,
      email,
      `${endereco.cep}-${endereco.numero}-${endereco.complemento}`,
    ];
    if (chaves.some((chave) => usados.has(chave))) {
      continue;
    }
    chaves.forEach((chave) => usados.add(chave));

    const pessoa: PessoaMassa = {
      cpfCnpj,
      nomeCompleto,
      telefone,
      email,
      ...endereco,
    };
    validarPessoa(pessoa, uf);
    return pessoa;
  }

  throw new Error(`Não foi possível gerar massa única para a UF ${uf}`);
}

export function gerarVeiculoNovoPorUf(ufOuDetran: string): VeiculoNovoMassa {
  return {
    chassi: gerarChassiUnico(ufOuDetran),
    ano: '2024',
    modelo: '2025',
    gravame: gerarGravameUnico(),
    cor: 'Prata',
  };
}

export function gerarVeiculoUsadoPorUf(ufOuDetran: string): VeiculoUsadoMassa {
  const endereco = obterEnderecoPorUf(ufOuDetran);
  return {
    chassi: gerarChassiUnico(ufOuDetran),
    renavam: gerarRenavamUnico(),
    placa: gerarPlacaUnica(),
    ufPlaca: endereco.estado,
    ano: '2020',
    modelo: '2021',
    gravame: gerarGravameUnico(),
    cor: 'Prata',
  };
}

export { UFS };
