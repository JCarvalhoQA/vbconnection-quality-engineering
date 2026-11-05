import { test, expect } from '@playwright/test';
import {
  shouldAbortPersist,
  shouldFallbackRegistrar,
  isPersistUrl,
  isAuthAllowlist,
  isApiUrl,
  isAuthUrl,
  isMutatingMethod,
} from '../support/persistGuard';

test.describe('E2 persistGuard @mocked', () => {
  test('POST contratos/registrar cai no mock via fallback, não aborta', () => {
    const url = 'https://newfront.vbconnection.info/api/contratos/registrar';
    expect(isPersistUrl(url)).toBe(true);
    expect(shouldFallbackRegistrar('POST', url)).toBe(true);
    expect(shouldAbortPersist('POST', url)).toBe(false);
  });

  test('GET não é abortado mesmo em URL de persistência', () => {
    expect(shouldAbortPersist('GET', 'https://host/api/contratos/123')).toBe(false);
  });

  test('POST de lote/aditivo/imagem/B3/contrato singular é abortado', () => {
    const urls = [
      'https://host/api/lotes',
      'https://host/api/aditivos',
      'https://host/api/imagens/upload',
      'https://host/api/b3/enviar',
      'https://host/api/contratos/123',
      'https://host/api/contrato',
      'https://host/api/contrato/salvar',
      'https://host/api/gravames',
    ];
    for (const url of urls) {
      expect(shouldAbortPersist('POST', url), url).toBe(true);
    }
  });

  test('consulta servicos-cliente não entra no guard de persistência mocked', () => {
    expect(isPersistUrl('https://host/api/servicos-cliente/vigente')).toBe(false);
    expect(shouldAbortPersist('POST', 'https://host/api/servicos-cliente/vigente')).toBe(false);
  });

  test('métodos mutáveis são POST/PUT/PATCH/DELETE', () => {
    expect(isMutatingMethod('POST')).toBe(true);
    expect(isMutatingMethod('GET')).toBe(false);
    expect(isMutatingMethod('OPTIONS')).toBe(false);
  });

  test('live-readonly aborta registrar e demais mutações /api/, mas libera auth', () => {
    const registrar = 'https://host/api/contratos/registrar';
    expect(shouldFallbackRegistrar('POST', registrar, 'live-readonly')).toBe(false);
    expect(shouldAbortPersist('POST', registrar, 'live-readonly')).toBe(true);
    expect(shouldAbortPersist('POST', 'https://host/api/servicos-cliente/vigente', 'live-readonly')).toBe(true);
    expect(shouldAbortPersist('GET', 'https://host/api/fornecedores/destinos-combo', 'live-readonly')).toBe(false);
    expect(isAuthAllowlist('https://hmg.vbconnection.info/vbauto.api/auth/tokens')).toBe(true);
    expect(isAuthUrl('https://hmg.vbconnection.info/vbauto.api/auth/tokens')).toBe(true);
    expect(isApiUrl('https://hmg.vbconnection.info/vbauto.api/auth/tokens')).toBe(false);
    expect(shouldAbortPersist('POST', 'https://hmg.vbconnection.info/vbauto.api/auth/tokens', 'live-readonly')).toBe(
      false,
    );
  });
});
