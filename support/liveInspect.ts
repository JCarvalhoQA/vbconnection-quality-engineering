import { Page, test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { LoginCredentials } from '../fixtures/login';
import { LIVE_EVIDENCE_DIR } from './repoPaths';

const EVIDENCE_DIR = LIVE_EVIDENCE_DIR;

export function sanitizeEvidenceText(text: string): string {
  return String(text || '')
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer [REDACTED]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[REDACTED_CPF]')
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, '[REDACTED_CNPJ]')
    .replace(/"(access_token|refresh_token|token|password|senha|cookie|authorization)"\s*:\s*"[^"]*"/gi, '"$1":"[REDACTED]"');
}

export function masterCredentialsFromEnv(): LoginCredentials | null {
  const username = process.env.PLAYWRIGHT_MASTER_USER;
  const password = process.env.PLAYWRIGHT_MASTER_PASSWORD;
  if (!username || !password) {
    return null;
  }
  return {
    username,
    password,
    nome: process.env.PLAYWRIGHT_MASTER_NAME,
    email: process.env.PLAYWRIGHT_MASTER_EMAIL,
    perfil: process.env.PLAYWRIGHT_MASTER_PERFIL ?? 'MASTER',
  };
}

export function requireMasterCredentials(): LoginCredentials {
  const cred = masterCredentialsFromEnv();
  if (!cred) {
    if (process.env.CI) {
      throw new Error(
        'live-readonly requires PLAYWRIGHT_MASTER_USER/PASSWORD from the live-readonly GitHub Environment.',
      );
    }
    test.skip(true, 'PLAYWRIGHT_MASTER_USER/PASSWORD ausentes — Gate 0 bloqueado.');
    throw new Error('unreachable');
  }
  return cred;
}

export function extractPerfil(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') {
    return undefined;
  }
  const root = body as { perfil?: unknown; perfilEnum?: unknown };
  if (typeof root.perfilEnum === 'string') {
    return root.perfilEnum;
  }
  if (typeof root.perfil === 'string') {
    return root.perfil;
  }
  if (root.perfil && typeof root.perfil === 'object') {
    const nested = root.perfil as { perfil?: unknown; nome?: unknown; codigo?: unknown };
    if (typeof nested.perfil === 'string') {
      return nested.perfil;
    }
    if (typeof nested.nome === 'string') {
      return nested.nome;
    }
    if (typeof nested.codigo === 'string') {
      return nested.codigo;
    }
  }
  return undefined;
}

export function summarizeAuthBody(body: unknown): Record<string, unknown> {
  if (body === null || body === undefined) {
    return { tipo: 'vazio' };
  }
  if (typeof body !== 'object') {
    return { tipo: typeof body };
  }
  if (Array.isArray(body)) {
    const first = body[0];
    return {
      tipo: 'array',
      n: body.length,
      keysPrimeiro: first && typeof first === 'object' ? Object.keys(first as object) : [],
      perfil: extractPerfil(first) ?? null,
    };
  }
  const root = body as Record<string, unknown>;
  return {
    keys: Object.keys(root),
    hasToken: typeof root.token === 'string' && String(root.token).length > 0,
    autenticaEmDuasEtapas: root.autenticaEmDuasEtapas === true,
    passwordExpirado: root.passwordExpirado === true,
    perfil: extractPerfil(body) ?? null,
  };
}

export const AUTH_PASSWORD_EXPIRED = 'AUTH_PASSWORD_EXPIRED';
export const AUTH_TWO_FACTOR = 'AUTH_TWO_FACTOR';
export const AUTH_NO_TOKEN = 'AUTH_NO_TOKEN';
export const AUTH_TOKENS_HTTP = 'AUTH_TOKENS_HTTP';

export class LiveAuthBlockedError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'LiveAuthBlockedError';
    this.code = code;
  }
}

const SECRET_UPDATE_HINT =
  'Após a troca autorizada, atualize o secret PLAYWRIGHT_MASTER_PASSWORD no Environment live-readonly. Não altere a senha automaticamente e não registre a credencial em logs ou artifacts.';

export interface LiveAuthDiagnosisInput {
  readonly tokensStatus?: number;
  readonly tokensResumo: Record<string, unknown>;
  readonly urlAposLogin?: string;
  readonly alterarSenhaVisivel?: boolean;
}

export type LiveAuthDiagnosis =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: string; readonly message: string };

function urlIndicaTrocaDeSenha(url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  return /alterar|senha|expirad/i.test(url);
}

export function diagnoseLiveAuth(input: LiveAuthDiagnosisInput): LiveAuthDiagnosis {
  const expirado =
    input.tokensResumo.passwordExpirado === true ||
    input.alterarSenhaVisivel === true ||
    urlIndicaTrocaDeSenha(input.urlAposLogin);
  if (expirado) {
    return {
      ok: false,
      code: AUTH_PASSWORD_EXPIRED,
      message: `Falha de autenticação por expiração da senha Master. Interrompa a execução. ${SECRET_UPDATE_HINT}`,
    };
  }
  if (input.tokensResumo.autenticaEmDuasEtapas === true) {
    return {
      ok: false,
      code: AUTH_TWO_FACTOR,
      message: 'Falha de autenticação: a API exigiu verificação em duas etapas. Live-readonly Master não segue o fluxo de 2FA.',
    };
  }
  if (input.tokensStatus !== undefined && input.tokensStatus !== 200) {
    return {
      ok: false,
      code: AUTH_TOKENS_HTTP,
      message: `Falha de autenticação: POST /auth/tokens retornou HTTP ${input.tokensStatus}.`,
    };
  }
  if (input.tokensResumo.hasToken !== true) {
    return {
      ok: false,
      code: AUTH_NO_TOKEN,
      message: 'Falha de autenticação: POST /auth/tokens não devolveu token utilizável.',
    };
  }
  return { ok: true };
}

export function assertLiveAuthUsable(input: LiveAuthDiagnosisInput): void {
  const diagnosis = diagnoseLiveAuth(input);
  if (!diagnosis.ok) {
    throw new LiveAuthBlockedError(diagnosis.code, diagnosis.message);
  }
}

export interface AuthCapture {
  tokens?: { status: number; url: string; body: unknown };
  prefs2?: { status: number; url: string; body: unknown };
  prefs2Statuses?: number[];
  destinos?: unknown;
}

/**
 * Prefs2 401 antes do POST /auth/tokens é sonda anônima da SPA — não prova sessão.
 * Depois de tokens 200, qualquer prefs2 (200 ou 401) é evidência da autenticação atual.
 * HTTP 401 nunca é tratado como sucesso pelo caller.
 */
export function shouldAssignPrefs2Capture(tokensStatus: number | undefined, prefsStatus: number): boolean {
  if (tokensStatus === 200) {
    return true;
  }
  return prefsStatus !== 401;
}

/**
 * Pass-through da autenticação real (route.fetch + fulfill). Não mocka login.
 * Captura o JSON antes da navegação da SPA descartar o body no CDP.
 */
export async function installAuthCapture(page: Page, capture: AuthCapture): Promise<void> {
  await page.route(/\/auth\/(tokens|prefs2)(\/|$|\?)/i, async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.continue();
      return;
    }

    const response = await route.fetch();
    const text = await response.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
    }

    const record = { status: response.status(), url: request.url(), body };
    if (/\/auth\/tokens/i.test(request.url()) && request.method() === 'POST') {
      capture.tokens = record;
    }
    if (/\/auth\/prefs2/i.test(request.url()) && request.method() === 'GET') {
      capture.prefs2Statuses = [...(capture.prefs2Statuses ?? []), record.status];
      if (shouldAssignPrefs2Capture(capture.tokens?.status, record.status)) {
        capture.prefs2 = record;
      }
    }

    const headers = { ...response.headers() };
    delete headers['content-encoding'];
    delete headers['content-length'];
    await route.fulfill({
      status: response.status(),
      headers,
      body: text,
    });
  });
}

export function assertMasterProfile(body: unknown): string {
  const perfil = extractPerfil(body);
  if (perfil !== 'MASTER') {
    test.info().annotations.push({
      type: 'gate0',
      description: `BLOQUEADO: perfil autenticado não comprovado como MASTER (obtido=${perfil ?? 'indeterminado'})`,
    });
    throw new Error(
      `Gate 0 bloqueado: a interface/API não comprovou perfil MASTER (obtido=${perfil ?? 'indeterminado'}).`,
    );
  }
  return perfil;
}

export function sanitizeDestinos(body: unknown): unknown {
  return JSON.parse(sanitizeEvidenceText(JSON.stringify(body ?? null)));
}

export async function captureSanitizedPage02(page: Page, uf: string): Promise<{ htmlPath: string; screenshotPath: string }> {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  const htmlPath = join(EVIDENCE_DIR, `page02-${uf.toLowerCase()}.html`);
  const screenshotPath = join(EVIDENCE_DIR, `page02-${uf.toLowerCase()}.png`);
  const html = sanitizeEvidenceText(await page.content());
  writeFileSync(htmlPath, html, 'utf8');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return { htmlPath, screenshotPath };
}

export function writeGate0Json(fileName: string, payload: unknown): string {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  const target = join(EVIDENCE_DIR, fileName);
  const sanitized = sanitizeEvidenceText(JSON.stringify(payload, null, 2));
  writeFileSync(target, `${sanitized}\n`, 'utf8');
  return target;
}

export async function installDestinosCapture(page: Page, capture: AuthCapture): Promise<void> {
  await page.route(/destinos-combo/i, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    capture.destinos = sanitizeDestinos(parsed);
    const headers = { ...response.headers() };
    delete headers['content-encoding'];
    delete headers['content-length'];
    await route.fulfill({ status: response.status(), headers, body: text });
  });
}

export function extractDestinoUfs(body: unknown): string[] {
  const root = body as { content?: unknown; data?: unknown; destinos?: unknown } | unknown[] | null;
  const items = Array.isArray(root)
    ? root
    : Array.isArray((root as { content?: unknown })?.content)
      ? (root as { content: unknown[] }).content
      : Array.isArray((root as { data?: unknown })?.data)
        ? (root as { data: unknown[] }).data
        : Array.isArray((root as { destinos?: unknown })?.destinos)
          ? (root as { destinos: unknown[] }).destinos
          : [];

  const ufs = items
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return '';
      }
      const row = item as {
        sigla?: unknown;
        uf?: unknown;
        codigoUf?: unknown;
        codigo?: unknown;
        nomeFantasia?: unknown;
        nome?: unknown;
      };
      const raw = String(row.codigoUf ?? row.sigla ?? row.uf ?? row.nomeFantasia ?? row.codigo ?? row.nome ?? '');
      return raw.replace(/^DETRAN-?/i, '').trim().toUpperCase();
    })
    .map((value) => value.replace(/[^A-Z]/g, '').slice(0, 2))
    .filter((value) => /^[A-Z]{2}$/.test(value));

  return [...new Set(ufs)].sort();
}

export async function inventoryVisiblePage(page: Page): Promise<{
  url: string;
  headings: string[];
  fields: Array<{
    label: string;
    requiredVisual: boolean;
    tag: string | null;
    id: string | null;
    formControl: string | null;
  }>;
  buttons: string[];
}> {
  const raw = await page.evaluate(() => {
    const text = (el: Element | null) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
    const headings = [...document.querySelectorAll('h1, h2, h3, [role="heading"]')]
      .map((el) => text(el))
      .filter(Boolean);
    const fieldRoots = [
      ...document.querySelectorAll('app-consult-filter-field, nz-form-item, .ant-form-item'),
    ];
    const fields = fieldRoots.map((el) => {
      const label = text(el.querySelector('label, .ant-form-item-label, .field-label, span'));
      const requiredVisual =
        /\*/.test(label) ||
        el.classList.contains('ant-form-item-has-error') ||
        !!el.querySelector('.ant-form-item-required, [aria-required="true"]');
      const control = el.querySelector('input, textarea, nz-select, nz-date-picker, nz-input-number');
      return {
        label,
        requiredVisual,
        tag: control?.tagName.toLowerCase() ?? null,
        id: control?.id || control?.getAttribute('ng-reflect-name') || null,
        formControl:
          control?.getAttribute('formcontrolname') ||
          control?.getAttribute('ng-reflect-name') ||
          null,
      };
    });
    const buttons = [...document.querySelectorAll('button')]
      .map((el) => text(el))
      .filter(Boolean)
      .slice(0, 40);
    return { url: location.href, headings, fields, buttons };
  });

  return JSON.parse(sanitizeEvidenceText(JSON.stringify(raw)));
}

export type DeepField = {
  label: string;
  secao: string | null;
  requiredVisual: boolean;
  tag: string | null;
  id: string | null;
  formControl: string | null;
  placeholder: string | null;
  maxlength: number | null;
  disabled: boolean;
  readonly: boolean;
  inputType: string | null;
  validation: string | null;
};

export async function inventoryDeep(page: Page, scopeSelector?: string): Promise<{
  url: string;
  scope: string;
  headings: string[];
  fields: DeepField[];
  radios: Array<{ name: string | null; label: string; checked: boolean }>;
  checkboxes: Array<{ label: string; checked: boolean }>;
  buttons: string[];
}> {
  const raw = await page.evaluate((scopeSel: string | undefined) => {
    const text = (el: Element | null) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
    const root = (scopeSel ? document.querySelector(scopeSel) : document.body) as HTMLElement | null;
    if (!root) {
      return { url: location.href, scope: scopeSel ?? 'document', headings: [], fields: [], radios: [], checkboxes: [], buttons: [] };
    }
    const headings = [...root.querySelectorAll('h1, h2, h3, [role="heading"]')].map((el) => text(el)).filter(Boolean);
    const fieldRoots = [...root.querySelectorAll('app-consult-filter-field, nz-form-item, .ant-form-item')];
    const fields = fieldRoots.map((el) => {
      const article = el.closest('article, [role="dialog"], .ant-modal, .ant-drawer');
      const secao = text(article?.querySelector('h1, h2, h3, .ant-modal-title, [role="heading"]') ?? null) || null;
      const label = text(el.querySelector('label, .ant-form-item-label, .field-label'));
      const requiredVisual =
        /\*/.test(label) ||
        el.classList.contains('ant-form-item-required') ||
        !!el.querySelector('.ant-form-item-required, [aria-required="true"]');
      const control = el.querySelector('input, textarea, nz-select, nz-date-picker, nz-input-number, nz-radio-group');
      const input = el.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
      const maxAttr = input?.getAttribute('maxlength');
      const maxParsed = maxAttr ? Number(maxAttr) : input && 'maxLength' in input ? input.maxLength : null;
      return {
        label,
        secao,
        requiredVisual,
        tag: control?.tagName.toLowerCase() ?? null,
        id: control?.id || input?.id || null,
        formControl:
          control?.getAttribute('formcontrolname') ||
          control?.getAttribute('ng-reflect-name') ||
          input?.getAttribute('formcontrolname') ||
          null,
        placeholder: input?.getAttribute('placeholder') || null,
        maxlength: maxParsed && maxParsed > 0 && maxParsed < 100000 ? maxParsed : null,
        disabled: !!(input?.disabled || control?.classList.contains('ant-select-disabled') || control?.getAttribute('ng-reflect-disabled') === 'true'),
        readonly: !!input?.readOnly,
        inputType: input?.getAttribute('type') || null,
        validation: text(el.querySelector('.ant-form-item-explain, .ant-form-item-explain-error, .text-vb-danger')) || null,
      };
    });
    const radios = [...root.querySelectorAll('label.ant-radio-wrapper, nz-radio')].map((el) => ({
      name: el.querySelector('input')?.getAttribute('name') || null,
      label: text(el),
      checked: !!(el.querySelector('input') as HTMLInputElement | null)?.checked || el.classList.contains('ant-radio-wrapper-checked'),
    }));
    const checkboxes = [...root.querySelectorAll('label.ant-checkbox-wrapper, nz-checkbox')].map((el) => ({
      label: text(el),
      checked: !!(el.querySelector('input') as HTMLInputElement | null)?.checked || el.classList.contains('ant-checkbox-wrapper-checked'),
    }));
    const buttons = [...root.querySelectorAll('button')].map((el) => text(el)).filter(Boolean).slice(0, 50);
    return { url: location.href, scope: scopeSel ?? 'document', headings, fields, radios, checkboxes, buttons };
  }, scopeSelector);

  return JSON.parse(sanitizeEvidenceText(JSON.stringify(raw)));
}

export async function captureSelectOptions(page: Page, combobox: import('@playwright/test').Locator): Promise<string[]> {
  if ((await combobox.count()) === 0 || !(await combobox.first().isVisible().catch(() => false))) {
    return [];
  }
  const disabled =
    !(await combobox.first().isEnabled().catch(() => true)) ||
    (await combobox.first().getAttribute('aria-disabled').catch(() => null)) === 'true' ||
    (await combobox.first().evaluate((el) => el.classList.contains('ant-select-disabled')).catch(() => false));
  if (disabled) {
    return ['__disabled__'];
  }
  await combobox.first().click({ timeout: 3_000 }).catch(() => undefined);
  const overlay = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
  const opened = await overlay.isVisible().catch(() => false);
  if (!opened) {
    await page.keyboard.press('Escape').catch(() => undefined);
    return [];
  }
  const options = await overlay.locator('.ant-select-item-option, [role="option"]').evaluateAll((els) =>
    els.map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean),
  );
  await page.keyboard.press('Escape');
  return [...new Set(options)];
}

export async function captureSanitizedShot(page: Page, name: string): Promise<{ htmlPath: string; screenshotPath: string }> {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  const htmlPath = join(EVIDENCE_DIR, `${name}.html`);
  const screenshotPath = join(EVIDENCE_DIR, `${name}.png`);
  writeFileSync(htmlPath, sanitizeEvidenceText(await page.content()), 'utf8');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return { htmlPath, screenshotPath };
}

export { EVIDENCE_DIR };
