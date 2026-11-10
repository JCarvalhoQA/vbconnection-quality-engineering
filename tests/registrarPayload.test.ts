import { test, expect } from '@playwright/test';
import { interpretarPostData, payloadContemCampo } from '../support/registrarPayload';

test.describe('interpretarPostData @mocked', () => {
  test('JSON válido expõe chassi e número', () => {
    const visto = interpretarPostData('{"chassi":"9BWZZZ377VT004251","numero":"E2EBA123"}');
    expect(visto.json).toEqual({ chassi: '9BWZZZ377VT004251', numero: 'E2EBA123' });
    expect(payloadContemCampo(visto.bruto, '9BWZZZ377VT004251')).toBe(true);
    expect(payloadContemCampo(visto.bruto, 'E2EBA123')).toBe(true);
  });

  test('texto não JSON permanece bruto', () => {
    const visto = interpretarPostData('chassi=9BWZZZ377VT004251');
    expect(visto.json).toBeNull();
    expect(payloadContemCampo(visto.bruto, '9BWZZZ377VT004251')).toBe(true);
  });

  test('vazio não conta como campo presente', () => {
    const visto = interpretarPostData(null);
    expect(visto.bruto).toBe('');
    expect(payloadContemCampo(visto.bruto, 'E2E')).toBe(false);
  });
});
