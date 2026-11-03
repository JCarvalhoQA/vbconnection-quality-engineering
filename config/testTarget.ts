export type TestTarget = Readonly<{
  mode: 'mock' | 'integration';
  baseURL: string;
  allowedOrigins: readonly string[];
}>;

export class TestTargetError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = 'TestTargetError';
  }
}

export function parseTargetUrl(value: unknown, base?: string): URL {
  if (typeof value !== 'string' || !value || value.trim() !== value) {
    throw new TestTargetError('TARGET_INVALID_URL');
  }
  let url: URL;
  try { url = base ? new URL(value, base) : new URL(value); }
  catch { throw new TestTargetError('TARGET_INVALID_URL'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new TestTargetError('TARGET_UNSAFE_URL');
  }
  return url;
}

export function resolveTestTarget(input: unknown): TestTarget {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TestTargetError('TARGET_INVALID_CONFIG');
  }
  const config = input as Record<string, unknown>;
  const mode = config.mode === undefined ? 'mock' : config.mode;
  if (mode !== 'mock' && mode !== 'integration') {
    throw new TestTargetError('TARGET_INVALID_MODE');
  }
  const base = parseTargetUrl(config.baseURL);
  if (base.search || base.hash) throw new TestTargetError('TARGET_UNSAFE_BASE');
  if (!Array.isArray(config.allowedOrigins) || !config.allowedOrigins.length) {
    throw new TestTargetError('TARGET_MISSING_ALLOWLIST');
  }
  const allowedOrigins = config.allowedOrigins.map((value: unknown) => {
    const origin = parseTargetUrl(value);
    if (origin.pathname !== '/' || origin.search || origin.hash) {
      throw new TestTargetError('TARGET_INVALID_ORIGIN');
    }
    if (mode === 'mock' && !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) {
      throw new TestTargetError('TARGET_REMOTE_IN_MOCK');
    }
    return origin.origin;
  });
  if (!allowedOrigins.includes(base.origin)) throw new TestTargetError('TARGET_ORIGIN_DENIED');
  return Object.freeze({
    mode, baseURL: base.href, allowedOrigins: Object.freeze([...new Set(allowedOrigins)]),
  });
}
