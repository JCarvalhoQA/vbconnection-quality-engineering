/**
 * Validates PLAYWRIGHT_MODE / SUITE / PLAYWRIGHT_TARGET / PLAYWRIGHT_UFS
 * and prints Playwright args. Pull requests cannot select live-readonly.
 * Target hmg is rejected (institutional site). UFS only apply to suite=structural
 * and only to implemented PAGE-02 specs — never to persistent registration.
 */
import { appendFileSync } from 'node:fs';

const mode = process.env.PLAYWRIGHT_MODE || 'mocked';
const suite = process.env.SUITE || 'smoke';
const target = process.env.PLAYWRIGHT_TARGET || 'newfront';
const eventName = process.env.GITHUB_EVENT_NAME || '';
const ufsRaw = process.env.PLAYWRIGHT_UFS || '';

/** Specs estruturais já existentes. Não inclui lotes futuros nem SE. */
export const STRUCTURAL_UFS_IMPLEMENTED = ['AC', 'AP', 'BA', 'CE', 'DF', 'ES', 'RO'];

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(2);
}

export function parseStructuralUfs(raw, implemented = STRUCTURAL_UFS_IMPLEMENTED) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) {
    return [];
  }
  const tokens = trimmed
    .split(/[,\s]+/)
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  if (!tokens.length) {
    fail('PLAYWRIGHT_UFS is empty after parsing.');
  }
  const unique = [...new Set(tokens)];
  for (const uf of unique) {
    if (!/^[A-Z]{2}$/.test(uf)) {
      fail(`UF not authorized: ${uf}`);
    }
    if (!implemented.includes(uf)) {
      fail(
        `UF ${uf} is not in the implemented structural allowlist (${implemented.join(',')}). Registration specs cannot be selected this way.`,
      );
    }
  }
  return unique;
}

if (!['mocked', 'live-readonly'].includes(mode)) {
  fail(`Mode not authorized: ${mode}`);
}
if (!['smoke', 'regression', 'structural'].includes(suite)) {
  fail(`Suite not authorized: ${suite}`);
}
if (!['newfront', 'hmg'].includes(target)) {
  fail(`Target not authorized: ${target}`);
}
if (target === 'hmg') {
  fail(
    'Target hmg is not authorized for this suite: the homologation host currently serves the institutional site, not the Nova UX SPA. Use newfront.',
  );
}
if (mode === 'live-readonly' && eventName === 'pull_request') {
  fail('live-readonly is not available on pull requests.');
}
if (mode === 'live-readonly') {
  if (!process.env.PLAYWRIGHT_MASTER_USER || !process.env.PLAYWRIGHT_MASTER_PASSWORD) {
    fail('live-readonly requires Master credentials from the live-readonly GitHub Environment.');
  }
}

const selectedUfs = parseStructuralUfs(ufsRaw);
if (selectedUfs.length && suite !== 'structural') {
  fail('PLAYWRIGHT_UFS is only valid with suite=structural.');
}

const project = 'vbconnection-newfront';
const grepTag = mode === 'live-readonly' ? '@live-readonly' : '@mocked';
let args = `--project=${project}`;

if (mode === 'mocked' && suite === 'smoke') {
  args += ' --grep @smoke --grep-invert @live-readonly';
} else if (mode === 'mocked' && suite === 'regression') {
  args += ' --grep-invert @live-readonly';
} else if (suite === 'regression' && mode === 'live-readonly') {
  args += ' --grep @live-readonly';
} else {
  const files = (selectedUfs.length ? selectedUfs : STRUCTURAL_UFS_IMPLEMENTED).map(
    (uf) => `e2e/contratos/page02/${uf.toLowerCase()}-estrutural.spec.ts`,
  );
  args += ` ${files.join(' ')} --grep ${grepTag}`;
}

console.log(`project=${project}`);
console.log(`args=${args}`);
console.log(`mode=${mode}`);
console.log(`suite=${suite}`);
console.log(`target=${target}`);
console.log(`ufs=${selectedUfs.join(',') || STRUCTURAL_UFS_IMPLEMENTED.join(',')}`);
console.log(`lote=${selectedUfs.join(',') === 'AC,AP,DF,ES' ? '01' : selectedUfs.join(',') === 'BA,CE,RO' ? 'baseline' : 'structural'}`);

if (process.env.GITHUB_OUTPUT) {
  const ufsOut = selectedUfs.join(',') || STRUCTURAL_UFS_IMPLEMENTED.join(',');
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `project=${project}`,
      `mode=${mode}`,
      `suite=${suite}`,
      `target=${target}`,
      `ufs=${ufsOut}`,
      'args<<EOF',
      args,
      'EOF',
      '',
    ].join('\n'),
  );
}
