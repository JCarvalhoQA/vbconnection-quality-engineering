import { test, expect } from '@playwright/test';
import { corpoMockRegistrar } from '../support/contratoCadastroMocks';

test.describe('corpoMockRegistrar @mocked', () => {
  test('200 devolve protocolo RECEBIDO', () => {
    expect(corpoMockRegistrar('E2E-BA-1', 200)).toEqual({ protocolo: 'E2E-BA-1', status: 'RECEBIDO' });
  });

  test('5xx devolve corpo vazio sem inventar copy de erro', () => {
    expect(corpoMockRegistrar('E2E-BA-1', 500)).toEqual({});
    expect(corpoMockRegistrar('E2E-BA-1', 503)).toEqual({});
  });
});
