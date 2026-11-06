import { test, expect } from '@playwright/test';
import { isNgZorroHostTag, ngZorroHostSelector } from '../support/ngZorroField';
import { loadUfUiProfile } from '../support/ufUiProfile';

test.describe('Locators NG-ZORRO do inventário live @mocked', () => {
  test('dataContrato de RO usa o host nz-date-picker, não o id cru', () => {
    const ro = loadUfUiProfile('RO');
    const data = ro.fields.find((field) => field.id === 'dataContrato');
    expect(data?.tag).toBe('nz-date-picker');
    expect(isNgZorroHostTag(data?.tag)).toBe(true);
    expect(ngZorroHostSelector(data!.tag, data!.id!)).toBe('nz-date-picker#dataContrato');
    expect(ngZorroHostSelector(data!.tag, data!.id!)).not.toBe('#dataContrato');
  });

  test('parcelas e totalFinanciamento de RO são input nativo', () => {
    const ro = loadUfUiProfile('RO');
    expect(ro.fields.find((field) => field.id === 'parcelas')?.tag).toBe('input');
    expect(ro.fields.find((field) => field.id === 'totalFinanciamento')?.tag).toBe('input');
    expect(isNgZorroHostTag('input')).toBe(false);
  });

  test('terceiroUf de PR e RJ usa host nz-select, não o id cru', () => {
    for (const uf of ['PR', 'RJ'] as const) {
      const profile = loadUfUiProfile(uf);
      const campo = profile.fields.find((field) => field.id === 'terceiroUf');
      expect(campo?.tag).toBe('nz-select');
      expect(isNgZorroHostTag(campo?.tag)).toBe(true);
      expect(ngZorroHostSelector(campo!.tag!, campo!.id!)).toBe('nz-select#terceiroUf');
      expect(ngZorroHostSelector(campo!.tag!, campo!.id!)).not.toBe('#terceiroUf');
    }
    expect(loadUfUiProfile('PE').fields.some((field) => field.id === 'terceiroUf')).toBe(false);
    expect(loadUfUiProfile('RN').fields.some((field) => field.id === 'terceiroUf')).toBe(false);
  });

  test('lote 4 não expõe terceiroUf; dataContrato e vigência SP usam host NG-ZORRO', () => {
    for (const uf of ['RR', 'RS', 'SC', 'SP'] as const) {
      const profile = loadUfUiProfile(uf);
      expect(profile.fields.some((field) => field.id === 'terceiroUf')).toBe(false);
      const data = profile.fields.find((field) => field.id === 'dataContrato');
      expect(data?.tag).toBe('nz-date-picker');
      expect(isNgZorroHostTag(data?.tag)).toBe(true);
      expect(ngZorroHostSelector(data!.tag, data!.id!)).toBe('nz-date-picker#dataContrato');
    }
    const sp = loadUfUiProfile('SP');
    expect(ngZorroHostSelector('nz-date-picker', 'inicioVigencia')).toBe('nz-date-picker#inicioVigencia');
    expect(sp.fields.find((field) => field.id === 'inicioVigencia')?.tag).toBe('nz-date-picker');
    expect(sp.fields.find((field) => field.id === 'finalVigencia')?.tag).toBe('nz-date-picker');
    expect(loadUfUiProfile('RS').fields.find((field) => field.id === 'dataCadastro')?.tag).toBe('nz-date-picker');
  });

  test('lote 5: MA usa host NG-ZORRO em terceiroUf e dataPagamento; TO não tem TG', () => {
    const ma = loadUfUiProfile('MA');
    const terceiroUf = ma.fields.find((field) => field.id === 'terceiroUf');
    expect(terceiroUf?.tag).toBe('nz-select');
    expect(ngZorroHostSelector(terceiroUf!.tag, terceiroUf!.id!)).toBe('nz-select#terceiroUf');
    const pagamento = ma.fields.find((field) => field.id === 'dataPagamento');
    expect(pagamento?.tag).toBe('nz-date-picker');
    expect(ngZorroHostSelector(pagamento!.tag, pagamento!.id!)).toBe('nz-date-picker#dataPagamento');
    const to = loadUfUiProfile('TO');
    expect(to.fields.some((field) => field.id === 'terceiroUf')).toBe(false);
    expect(to.fields.find((field) => field.id === 'dataContrato')?.tag).toBe('nz-date-picker');
    expect(ngZorroHostSelector('nz-date-picker', 'dataContrato')).toBe('nz-date-picker#dataContrato');
  });

  test('dataPagamento de CE também é host de date-picker', () => {
    const ce = loadUfUiProfile('CE');
    const data = ce.fields.find((field) => field.id === 'dataPagamento');
    expect(data?.tag).toBe('nz-date-picker');
    expect(ngZorroHostSelector(data!.tag, data!.id!)).toBe('nz-date-picker#dataPagamento');
  });
});
