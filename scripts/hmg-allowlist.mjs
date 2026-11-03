/**
 * Allowlist do alvo HMG da suíte Playwright.
 * Produção, loopback e hosts fora desta lista são recusados.
 */
export const ALLOWED_HMG_HOSTS = Object.freeze([
  'newfront.vbconnection.info',
  'hmg.vbconnection.info',
]);

export class TargetError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TargetError';
    this.code = code;
  }
}

export function parseAllowedHmgUrl(value) {
  if (typeof value !== 'string' || value.trim() !== value || !value) {
    throw new TargetError('TARGET_INVALID_URL', 'URL do alvo HMG ausente ou inválida.');
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TargetError('TARGET_INVALID_URL', 'URL do alvo HMG malformada.');
  }

  if (url.protocol !== 'https:') {
    throw new TargetError('TARGET_UNSAFE_URL', 'O alvo HMG precisa usar https.');
  }
  if (url.username || url.password) {
    throw new TargetError('TARGET_UNSAFE_URL', 'Credencial na URL do alvo é recusada.');
  }
  if (url.search || url.hash) {
    throw new TargetError('TARGET_UNSAFE_URL', 'Query ou fragmento na URL do alvo é recusado.');
  }
  if (!ALLOWED_HMG_HOSTS.includes(url.hostname)) {
    throw new TargetError(
      'TARGET_ORIGIN_DENIED',
      `Host ${url.hostname} está fora da allowlist HMG.`,
    );
  }

  return url;
}
