import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { join } from 'path';
import { hasMatrizFixture, SECAO_TERCEIRO_GARANTIDOR, SECAO_VEICULO } from '../support/matrizLoader';
import { formMockFromUf } from '../support/uiFormMock';
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
});
