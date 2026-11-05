import { test, expect } from '@playwright/test';
import { ContratoFactory } from '../factories/contratoFactory';
import {
  campoObrigatorio,
  campoVisivel,
  hasMatrizFixture,
  loadMatrizFixture,
  MatrizIndisponivelError,
  SECAO_CONTRATO,
  SECAO_TERCEIRO_GARANTIDOR,
  SECAO_VEICULO,
  secaoVisivel,
  statusCampo,
} from '../support/matrizLoader';

test.describe('E2-04/E2-05 matriz por UF @mocked', () => {
  test('SE não possui fixture', () => {
    expect(hasMatrizFixture('SE')).toBe(false);
    expect(() => loadMatrizFixture('SE')).toThrow(MatrizIndisponivelError);
  });

  test('CE e RO existem como dado Java e ficam fora da suíte', () => {
    expect(hasMatrizFixture('CE')).toBe(true);
    expect(hasMatrizFixture('RO')).toBe(true);
    expect(loadMatrizFixture('CE').naSuitePlaywright).toBe(false);
    expect(loadMatrizFixture('RO').naSuitePlaywright).toBe(false);
  });

  test('BA: INDICA_NOVO_USADO obrigatório e ANO_FABRICACAO oculto', () => {
    const ba = loadMatrizFixture('BA');
    expect(statusCampo(ba, SECAO_VEICULO, 'INDICA_NOVO_USADO')).toBe('obrigatorio');
    expect(campoVisivel(ba, SECAO_VEICULO, 'ANO_FABRICACAO')).toBe(false);
    expect(campoVisivel(ba, SECAO_CONTRATO, 'TIPO_CONTRATO')).toBe(false);
    expect(secaoVisivel(ba, SECAO_TERCEIRO_GARANTIDOR)).toBe(false);
  });

  test('SP: TIPO_CONTRATO oculto; factory não escolhe tipo nem novo/usado', () => {
    const sp = loadMatrizFixture('SP');
    expect(campoVisivel(sp, SECAO_CONTRATO, 'TIPO_CONTRATO')).toBe(false);
    expect(campoVisivel(sp, SECAO_VEICULO, 'INDICA_NOVO_USADO')).toBe(false);
    const mass = ContratoFactory.registro('SP');
    expect(mass.contrato.tipo).toBeUndefined();
    expect(mass.veiculo.indicaNovoUsado).toBeUndefined();
    expect(mass.veiculo.ano).toBeDefined();
  });

  test('PR/RJ/ES: seção terceiro garantidor visível sem campo obrigatório', () => {
    for (const uf of ['PR', 'RJ', 'ES'] as const) {
      const fixture = loadMatrizFixture(uf);
      expect(secaoVisivel(fixture, SECAO_TERCEIRO_GARANTIDOR)).toBe(true);
      const campos = fixture.campos[SECAO_TERCEIRO_GARANTIDOR];
      const obrigatorios = Object.entries(campos).filter(([, cell]) => cell[0] && cell[1]);
      expect(obrigatorios).toEqual([]);
    }
  });

  test('BA factory preenche Novo/Usado e omite ano de fabricação', () => {
    const mass = ContratoFactory.registro('BA');
    expect(mass.veiculo.indicaNovoUsado).toBe('Novo');
    expect(mass.veiculo.ano).toBeUndefined();
    expect(mass.contrato.tipo).toBeUndefined();
  });

  test('ES omite DATA_CONTRATO na massa quando o campo é oculto', () => {
    expect(campoVisivel(loadMatrizFixture('ES'), SECAO_CONTRATO, 'DATA_CONTRATO')).toBe(false);
    expect(ContratoFactory.registro('ES').contrato.data).toBeUndefined();
  });

  test('cada fixture da suíte cita a origem Java', () => {
    for (const uf of ['BA', 'SP', 'PR', 'RJ', 'ES', 'RS'] as const) {
      const fixture = loadMatrizFixture(uf);
      expect(fixture.origem).toContain('matriz-form.json');
      expect(fixture.fonteJava).toContain('MatrizDados');
      expect(fixture.naSuitePlaywright).toBe(true);
      expect(campoObrigatorio(fixture, SECAO_VEICULO, 'NUMERO_CHASSI')).toBe(true);
    }
  });
});
