import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { join } from 'path';
import { hasMatrizFixture, SECAO_COMPLEMENTARES, SECAO_TERCEIRO_GARANTIDOR, SECAO_VEICULO } from '../support/matrizLoader';
import { UFS_ESTRUTURAIS } from '../config/destinosEstruturais';
import { camposCascaAssertaveis, formMockFromUf, headingRenderizavelNoMock } from '../support/uiFormMock';
import { loadUfUiProfile } from '../support/ufUiProfile';

test.describe('Mock /form a partir do inventário live @mocked', () => {
  test('MA não ganha fixture Java; o mock de form nasce só da UI', () => {
    expect(hasMatrizFixture('MA')).toBe(false);
    expect(existsSync(join(process.cwd(), 'fixtures', 'matriz', 'MA.json'))).toBe(false);
    expect(loadUfUiProfile('MA').matrizJava).toBe(false);

    const mock = formMockFromUf('MA');
    expect(mock.origem).toBe('LIVE_FIELD_INVENTORY');
    expect(mock.fonteJava).toBe('ausente');
    expect(mock.secoes[SECAO_TERCEIRO_GARANTIDOR]).toBe(true);
    expect(mock.secoes[SECAO_VEICULO]).toBe(true);
    expect(mock.campos[SECAO_VEICULO].NUMERO_CHASSI).toEqual([true, true]);
    expect(mock.campos[SECAO_VEICULO].NUMERO_RESTRICAO).toEqual([true, true]);
    expect(mock.campos[SECAO_VEICULO].TIPO_ESPECIE).toEqual([true, false]);
    expect(mock.campos[SECAO_VEICULO].INDICA_NOVO_USADO).toEqual([false, false]);
    expect(mock.campos[SECAO_VEICULO].LISTA_VEICULOS).toEqual([true, false]);
    expect(mock.campos[SECAO_TERCEIRO_GARANTIDOR].NOME).toEqual([true, false]);
    expect(mock.campos[SECAO_TERCEIRO_GARANTIDOR].NUMERO_DOCUMENTO).toEqual([true, false]);
  });

  test('SE sem formulário não gera mock de form', () => {
    expect(() => formMockFromUf('SE')).toThrow(/sem formulário/);
  });

  test('BA mapeia Índice do inventário para INDICE_SIGLA, a chave que o Angular /form entende', () => {
    const mock = formMockFromUf('BA');
    expect(mock.campos[SECAO_COMPLEMENTARES].INDICE_SIGLA).toEqual([true, true]);
    expect(mock.campos[SECAO_COMPLEMENTARES].GRUPO_CONSORCIO).toEqual([true, false]);
    expect(mock.campos[SECAO_COMPLEMENTARES].MORA_TAXA).toEqual([true, false]);
    expect(mock.campos[SECAO_VEICULO].TIPO_ESPECIE).toEqual([false, false]);
  });

  test('Documentos não entra no mock de headings — não há /form/documentos', () => {
    expect(headingRenderizavelNoMock('Documentos')).toBe(false);
    expect(headingRenderizavelNoMock('Credor')).toBe(true);
    expect(headingRenderizavelNoMock('Agente financeiro')).toBe(true);
    expect(headingRenderizavelNoMock('Terceiro garantidor')).toBe(true);
  });

  test('BA e CE declaram Documentos no inventário, mas o mock não trata o heading como estável', () => {
    const ba = loadUfUiProfile('BA');
    const ce = loadUfUiProfile('CE');
    expect(ba.documentos).toBe(true);
    expect(ce.documentos).toBe(true);
    expect(ba.headings).toContain('Documentos');
    expect(ce.headings).toContain('Documentos');
    expect(headingRenderizavelNoMock('Documentos')).toBe(false);
  });

  test('as 21 UFs têm campo obrigatório de casca mapeado no mock de form', () => {
    for (const uf of UFS_ESTRUTURAIS) {
      const profile = loadUfUiProfile(uf);
      const casca = camposCascaAssertaveis(profile);
      expect(casca.length, uf).toBeGreaterThan(0);
      expect(casca.some((field) => field.requiredVisual), uf).toBe(true);
      expect(formMockFromUf(uf).origem).toBe('LIVE_FIELD_INVENTORY');
    }
  });
});
