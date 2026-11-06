import { test, expect } from '@playwright/test';
import {
  AUTH_PASSWORD_EXPIRED,
  AUTH_TWO_FACTOR,
  LiveAuthBlockedError,
  assertLiveAuthUsable,
  diagnoseLiveAuth,
  extractPerfil,
  requireMasterCredentials,
  sanitizeEvidenceText,
  shouldAssignPrefs2Capture,
  summarizeAuthBody,
} from '../support/liveInspect';

test.describe('Gate 0 liveInspect sanitizer @mocked', () => {
  test('remove token, e-mail e CPF do dump', () => {
    const raw = '{"token":"abc.def.ghi","email":"qa@vbtech.info","cpf":"529.982.247-25"} Bearer xyz';
    const clean = sanitizeEvidenceText(raw);
    expect(clean).not.toContain('abc.def.ghi');
    expect(clean).not.toContain('qa@vbtech.info');
    expect(clean).not.toContain('529.982.247-25');
    expect(clean).toContain('[REDACTED]');
  });

  test('prefs2 401 pré-token não vira evidência de sessão', () => {
    expect(shouldAssignPrefs2Capture(undefined, 401)).toBe(false);
    expect(shouldAssignPrefs2Capture(undefined, 200)).toBe(true);
    expect(shouldAssignPrefs2Capture(200, 401)).toBe(true);
    expect(shouldAssignPrefs2Capture(200, 200)).toBe(true);
  });

  test('extractPerfil lê prefs2.perfil.perfil', () => {
    expect(extractPerfil({ perfil: { id: 9, perfil: 'MASTER' } })).toBe('MASTER');
    expect(extractPerfil({ perfil: 'ADMINISTRADOR' })).toBe('ADMINISTRADOR');
    expect(extractPerfil({})).toBeUndefined();
  });

  test('diagnostica senha Master expirada sem vazar credencial', () => {
    const resumo = summarizeAuthBody({
      token: 'token-senha-expirada-NAO-LOGAR',
      password: 'valor-secreto-nao-pode-aparecer',
      passwordExpirado: true,
    });
    expect(resumo.passwordExpirado).toBe(true);
    expect(resumo.hasToken).toBe(true);
    expect(JSON.stringify(resumo)).not.toContain('token-senha-expirada-NAO-LOGAR');
    expect(JSON.stringify(resumo)).not.toContain('valor-secreto-nao-pode-aparecer');

    const diagnosis = diagnoseLiveAuth({ tokensStatus: 200, tokensResumo: resumo });
    expect(diagnosis.ok).toBe(false);
    if (diagnosis.ok) {
      return;
    }
    expect(diagnosis.code).toBe(AUTH_PASSWORD_EXPIRED);
    expect(diagnosis.message).toMatch(/expiração da senha Master/);
    expect(diagnosis.message).toMatch(/PLAYWRIGHT_MASTER_PASSWORD/);
    expect(diagnosis.message).toMatch(/Não altere a senha automaticamente/);
    expect(diagnosis.message).not.toContain('token-senha-expirada-NAO-LOGAR');
    expect(diagnosis.message).not.toContain('valor-secreto-nao-pode-aparecer');
    expect(() => assertLiveAuthUsable({ tokensStatus: 200, tokensResumo: resumo })).toThrow(LiveAuthBlockedError);
  });

  test('heading Alterar senha ou URL de troca também bloqueiam live', () => {
    const okResumo = summarizeAuthBody({ token: 'e2e-token', tempoDeExpiracao: 30 });
    const byHeading = diagnoseLiveAuth({
      tokensStatus: 200,
      tokensResumo: okResumo,
      alterarSenhaVisivel: true,
    });
    expect(byHeading.ok).toBe(false);
    if (!byHeading.ok) {
      expect(byHeading.code).toBe(AUTH_PASSWORD_EXPIRED);
    }
    const byUrl = diagnoseLiveAuth({
      tokensStatus: 200,
      tokensResumo: okResumo,
      urlAposLogin: 'https://newfront.vbconnection.info/alterar-senha',
    });
    expect(byUrl.ok).toBe(false);
    if (!byUrl.ok) {
      expect(byUrl.code).toBe(AUTH_PASSWORD_EXPIRED);
    }
  });

  test('2FA e ausência de token têm códigos próprios', () => {
    const twoFactor = diagnoseLiveAuth({
      tokensStatus: 200,
      tokensResumo: summarizeAuthBody({ autenticaEmDuasEtapas: true, email: 'qa@example.com' }),
    });
    expect(twoFactor.ok).toBe(false);
    if (!twoFactor.ok) {
      expect(twoFactor.code).toBe(AUTH_TWO_FACTOR);
      expect(twoFactor.message).not.toContain('qa@example.com');
    }
    const noToken = diagnoseLiveAuth({
      tokensStatus: 200,
      tokensResumo: summarizeAuthBody({ tempoDeExpiracao: 30 }),
    });
    expect(noToken.ok).toBe(false);
    if (!noToken.ok) {
      expect(noToken.code).toBe('AUTH_NO_TOKEN');
    }
    expect(
      diagnoseLiveAuth({
        tokensStatus: 200,
        tokensResumo: summarizeAuthBody({ token: 'e2e-token' }),
      }),
    ).toEqual({ ok: true });
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
