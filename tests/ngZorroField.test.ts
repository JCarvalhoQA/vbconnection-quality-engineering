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

  test('dataPagamento de CE também é host de date-picker', () => {
    const ce = loadUfUiProfile('CE');
    const data = ce.fields.find((field) => field.id === 'dataPagamento');
    expect(data?.tag).toBe('nz-date-picker');
    expect(ngZorroHostSelector(data!.tag, data!.id!)).toBe('nz-date-picker#dataPagamento');
  });
});
