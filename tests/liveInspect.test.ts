import { test, expect } from '@playwright/test';
import { extractPerfil, requireMasterCredentials, sanitizeEvidenceText } from '../support/liveInspect';

test.describe('Gate 0 liveInspect sanitizer @mocked', () => {
  test('remove token, e-mail e CPF do dump', () => {
    const raw = '{"token":"abc.def.ghi","email":"qa@vbtech.info","cpf":"529.982.247-25"} Bearer xyz';
    const clean = sanitizeEvidenceText(raw);
    expect(clean).not.toContain('abc.def.ghi');
    expect(clean).not.toContain('qa@vbtech.info');
    expect(clean).not.toContain('529.982.247-25');
    expect(clean).toContain('[REDACTED]');
  });

  test('extractPerfil lê prefs2.perfil.perfil', () => {
    expect(extractPerfil({ perfil: { id: 9, perfil: 'MASTER' } })).toBe('MASTER');
    expect(extractPerfil({ perfil: 'ADMINISTRADOR' })).toBe('ADMINISTRADOR');
    expect(extractPerfil({})).toBeUndefined();
  });

  test('CI sem Master falha em vez de skip', () => {
    const previousCi = process.env.CI;
    const previousUser = process.env.PLAYWRIGHT_MASTER_USER;
    const previousPassword = process.env.PLAYWRIGHT_MASTER_PASSWORD;
    process.env.CI = 'true';
    delete process.env.PLAYWRIGHT_MASTER_USER;
    delete process.env.PLAYWRIGHT_MASTER_PASSWORD;
    try {
      expect(() => requireMasterCredentials()).toThrow(/live-readonly requires PLAYWRIGHT_MASTER_USER/);
    } finally {
      if (previousCi === undefined) {
        delete process.env.CI;
      } else {
        process.env.CI = previousCi;
      }
      if (previousUser === undefined) {
        delete process.env.PLAYWRIGHT_MASTER_USER;
      } else {
        process.env.PLAYWRIGHT_MASTER_USER = previousUser;
      }
      if (previousPassword === undefined) {
        delete process.env.PLAYWRIGHT_MASTER_PASSWORD;
      } else {
        process.env.PLAYWRIGHT_MASTER_PASSWORD = previousPassword;
      }
    }
  });
});
