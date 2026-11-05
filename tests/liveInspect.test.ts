import { test, expect } from '@playwright/test';
import { extractPerfil, sanitizeEvidenceText } from '../support/liveInspect';

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
});
