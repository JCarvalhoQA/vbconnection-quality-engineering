import { test, expect } from '@playwright/test';
import { resolveTestTarget, TestTargetError } from '../config/testTarget';
import { assertAllowedUrl } from '../support/networkGuard';

const local = { baseURL: 'http://localhost:4200', allowedOrigins: ['http://localhost:4200'] };

test('B04-R01: modo ausente seleciona mock sem consultar ambiente do processo', () => {
  expect(resolveTestTarget(local)).toEqual({
    mode: 'mock', baseURL: 'http://localhost:4200/', allowedOrigins: ['http://localhost:4200'],
  });
});

for (const baseURL of ['http://127.0.0.1:8080', 'http://[::1]:8080']) {
  test('B04-R01: loopback explícito aceito ' + baseURL, () => {
    expect(resolveTestTarget({ baseURL, allowedOrigins: [baseURL] }).mode).toBe('mock');
  });
}

const invalid: [string, unknown][] = [
  ['sem baseURL não escolhe HMG', { allowedOrigins: local.allowedOrigins }],
  ['modo desconhecido', { ...local, mode: 'hmg' }],
  ['modo vazio', { ...local, mode: '' }],
  ['sem allowlist', { baseURL: local.baseURL }],
  ['allowlist vazia', { ...local, allowedOrigins: [] }],
  ['allowlist string', { ...local, allowedOrigins: local.baseURL }],
  ['base fora da allowlist', { ...local, allowedOrigins: ['http://localhost:8080'] }],
  ['remoto em mock mesmo listado', { baseURL: 'https://hmg.example.invalid', allowedOrigins: ['https://hmg.example.invalid'] }],
  ['localhost por substring', { baseURL: 'http://localhost.evil.invalid', allowedOrigins: ['http://localhost.evil.invalid'] }],
  ['credencial no alvo', { ...local, baseURL: 'http://user:CANARY_PASSWORD@localhost:4200' }],
  ['credencial na allowlist', { ...local, allowedOrigins: ['http://user:CANARY_PASSWORD@localhost:4200'] }],
  ['protocolo inválido', { baseURL: 'file:///tmp/app', allowedOrigins: ['file:///tmp/app'] }],
  ['URL relativa', { ...local, baseURL: '/login' }],
  ['URL malformada', { ...local, baseURL: 'not a URL' }],
  ['query no alvo', { ...local, baseURL: local.baseURL + '?token=CANARY_PASSWORD' }],
  ['fragmento no alvo', { ...local, baseURL: local.baseURL + '#CANARY_PASSWORD' }],
  ['path em origem', { ...local, allowedOrigins: [local.baseURL + '/api'] }],
  ['entrada nula', null],
];
for (const [name, input] of invalid) {
  test('B04-R01: rejeita ' + name + ' com erro seguro', () => {
    let caught: unknown;
    try { resolveTestTarget(input); } catch (error) { caught = error; }
    expect(caught).toBeInstanceOf(TestTargetError);
    expect((caught as TestTargetError).code).toMatch(/^TARGET_/);
    expect(String(caught)).not.toContain('CANARY_PASSWORD');
  });
}

test('B04-R01: integração requer seleção explícita e origem listada', () => {
  const target = resolveTestTarget({
    mode: 'integration', baseURL: 'https://integration.example.invalid',
    allowedOrigins: ['https://integration.example.invalid'],
  });
  expect(target.mode).toBe('integration');
  expect(() => assertAllowedUrl('https://other.example.invalid', target)).toThrow(TestTargetError);
});

test('B04-R01: allowlist não pode ser ampliada após resolução', () => {
  const origins = [...local.allowedOrigins];
  const target = resolveTestTarget({ ...local, allowedOrigins: origins });
  origins.push('http://localhost:9999');
  expect(() => assertAllowedUrl('http://localhost:9999', target)).toThrow(TestTargetError);
  expect(Object.isFrozen(target)).toBe(true);
  expect(Object.isFrozen(target.allowedOrigins)).toBe(true);
});

for (const url of [
  'http://localhost.evil.invalid', 'http://localhost:9999', 'https://localhost:4200',
  '//evil.example.invalid/path', 'javascript:alert(1)', 'ws://localhost:4200',
  'http://user:CANARY_PASSWORD@localhost:4200',
]) {
  test('B04-R01: guarda recusa origem/protocolo/credencial ' + url.replace('CANARY_PASSWORD', 'REDACTED'), () => {
    expect(() => assertAllowedUrl(url, resolveTestTarget(local))).toThrow(TestTargetError);
  });
}

test('B04-R01: guarda permite rota relativa sem efetuar conexão', () => {
  expect(assertAllowedUrl('/login?synthetic=true', resolveTestTarget(local)).href)
    .toBe('http://localhost:4200/login?synthetic=true');
});

test('B04-R01: variáveis conflitantes não selecionam integração nem fallback', () => {
  const overrides = {
    PLAYWRIGHT_BASE_URL: 'https://hmg-canary.example.invalid',
    PLAYWRIGHT_API_URL: 'https://api-canary.example.invalid',
    PLAYWRIGHT_AUTH_URL: 'https://auth-canary.example.invalid',
    PLAYWRIGHT_TEST_MODE: 'integration',
  };
  const previous = Object.fromEntries(Object.keys(overrides).map(key => [key, process.env[key]]));
  try {
    Object.assign(process.env, overrides);
    expect(resolveTestTarget(local).baseURL).toBe('http://localhost:4200/');
    expect(resolveTestTarget(local).mode).toBe('mock');
    expect(() => resolveTestTarget({ allowedOrigins: local.allowedOrigins })).toThrow(TestTargetError);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
