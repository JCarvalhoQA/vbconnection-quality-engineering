import { parseAllowedHmgUrl, TargetError } from './hmg-allowlist.mjs';

const DEFAULT_TARGET = 'https://newfront.vbconnection.info';
const DEFAULT_ATTEMPTS = 12;
const DEFAULT_DELAY_MS = 10_000;
const REQUEST_TIMEOUT_MS = 15_000;

function envInt(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) {
    throw new TargetError('TARGET_INVALID_CONFIG', `${name} precisa ser inteiro >= 1.`);
  }
  return value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probeOnce(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { Accept: 'text/html,application/xhtml+xml' },
    });
    const body = await response.text();
    return { status: response.status, body };
  } finally {
    clearTimeout(timer);
  }
}

function looksLikeLoginShell(body) {
  return /VB Connection/i.test(body) || /Faça o login para acessar/i.test(body);
}

async function main() {
  const target = parseAllowedHmgUrl(process.env.PLAYWRIGHT_NEWFRONT_URL || DEFAULT_TARGET);
  const origin = `${target.protocol}//${target.host}/`;
  const attempts = envInt('HMG_PROBE_ATTEMPTS', DEFAULT_ATTEMPTS);
  const delayMs = envInt('HMG_PROBE_DELAY_MS', DEFAULT_DELAY_MS);

  console.log(`Probe HMG host=${target.hostname} attempts=${attempts}`);

  let lastError = 'sem resposta';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await probeOnce(origin);
      if (result.status === 200 && looksLikeLoginShell(result.body)) {
        console.log(`Probe HMG ok attempt=${attempt} status=${result.status}`);
        process.exit(0);
      }
      lastError = `status=${result.status} sem shell de login reconhecível`;
      console.log(`Probe HMG tentativa ${attempt}/${attempts} ${lastError}`);
    } catch (error) {
      lastError = error.name === 'AbortError' ? 'timeout' : error.code || error.name;
      console.log(`Probe HMG tentativa ${attempt}/${attempts} erro=${lastError}`);
    }

    if (attempt < attempts) {
      await sleep(delayMs);
    }
  }

  console.error(`Probe HMG falhou após ${attempts} tentativas: ${lastError}`);
  process.exit(3);
}

main().catch((error) => {
  const code = error instanceof TargetError && error.code === 'TARGET_ORIGIN_DENIED' ? 2 : 2;
  console.error(`${error.code || 'PROBE_ERROR'}: ${error.message}`);
  process.exit(code);
});
