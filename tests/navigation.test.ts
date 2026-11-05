import { test, expect } from '@playwright/test';
import { isLoginPath, normalizeAppPath, pathnameMatchesTarget } from '../support/navigation';

test.describe('gotoApp helpers @mocked', () => {
  test('normalizeAppPath aceita relativo, absoluto e URL', () => {
    expect(normalizeAppPath('/')).toBe('/');
    expect(normalizeAppPath('vbconnection/home')).toBe('/vbconnection/home');
    expect(normalizeAppPath('/vbconnection/contrato/inserir')).toBe('/vbconnection/contrato/inserir');
    expect(normalizeAppPath('https://newfront.vbconnection.info/vbconnection/home')).toBe('/vbconnection/home');
  });

  test('isLoginPath cobre raiz e /login', () => {
    expect(isLoginPath('/')).toBe(true);
    expect(isLoginPath('/login')).toBe(true);
    expect(isLoginPath('/login/')).toBe(true);
    expect(isLoginPath('/vbconnection/home')).toBe(false);
  });

  test('pathnameMatchesTarget ignora barra final e query', () => {
    expect(pathnameMatchesTarget('/vbconnection/contrato/inserir', '/vbconnection/contrato/inserir')).toBe(true);
    expect(pathnameMatchesTarget('/vbconnection/contrato/inserir/', '/vbconnection/contrato/inserir')).toBe(true);
    expect(pathnameMatchesTarget('/vbconnection/home', '/vbconnection/contrato/inserir')).toBe(false);
  });
});
