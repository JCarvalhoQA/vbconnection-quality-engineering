/**
 * Validates PLAYWRIGHT_MODE / SUITE / PLAYWRIGHT_TARGET / PLAYWRIGHT_UFS
 * and prints Playwright args. Pull requests cannot select live-readonly.
 * Target hmg is rejected (institutional site). UFS only apply to suite=structural
 * and only to implemented PAGE-02 specs — never to persistent registration.
 */
import { appendFileSync } from 'node:fs';
import { describeLotes, STRUCTURAL_UFS_IMPLEMENTED } from './uf-lotes.mjs';

export { STRUCTURAL_UFS_IMPLEMENTED };

const mode = process.env.PLAYWRIGHT_MODE || 'mocked';
const suite = process.env.SUITE || 'smoke';
const target = process.env.PLAYWRIGHT_TARGET || 'newfront';
const eventName = process.env.GITHUB_EVENT_NAME || '';
const ufsRaw = process.env.PLAYWRIGHT_UFS || '';

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
  const ref = process.env.GITHUB_REF || '';
  if (ref && ref !== 'refs/heads/main') {
    fail('live-readonly is restricted to refs/heads/main.');
  }
  if (!process.env.PLAYWRIGHT_MASTER_USER || !process.env.PLAYWRIGHT_MASTER_PASSWORD) {
    fail('live-readonly requires Master credentials from the live-readonly GitHub Environment.');
  }
}

const requestedUfs = parseStructuralUfs(ufsRaw);
if (requestedUfs.length && suite !== 'structural') {
  fail('PLAYWRIGHT_UFS is only valid with suite=structural.');
}

const project = 'vbconnection-newfront';
const grepTag = mode === 'live-readonly' ? '@live-readonly' : '@mocked';
const usesStructuralFiles = suite === 'structural' || (mode === 'live-readonly' && suite === 'smoke');
let args = `--project=${project}`;
let selectedUfs = [];

if (mode === 'mocked' && suite === 'smoke') {
  args += ' --grep @smoke --grep-invert @live-readonly';
} else if (mode === 'mocked' && suite === 'regression') {
  args += ' --grep-invert @live-readonly';
} else if (suite === 'regression' && mode === 'live-readonly') {
  args += ' --grep @live-readonly';
} else if (usesStructuralFiles) {
  selectedUfs = requestedUfs.length ? requestedUfs : [...STRUCTURAL_UFS_IMPLEMENTED];
  const files = selectedUfs.map((uf) => `e2e/contratos/page02/${uf.toLowerCase()}-estrutural.spec.ts`);
  args += ` ${files.join(' ')} --grep ${grepTag}`;
} else {
  fail(`Suite/mode combination is not authorized: mode=${mode} suite=${suite}`);
}

const lote = selectedUfs.length ? describeLotes(selectedUfs) : 'n/d';
const ufsOut = selectedUfs.join(',');

console.log(`project=${project}`);
console.log(`args=${args}`);
console.log(`mode=${mode}`);
console.log(`suite=${suite}`);
console.log(`target=${target}`);
console.log(`requested=${requestedUfs.join(',') || '(empty)'}`);
console.log(`ufs=${ufsOut}`);
console.log(`lote=${lote}`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `project=${project}`,
      `mode=${mode}`,
      `suite=${suite}`,
      `target=${target}`,
      `requested=${requestedUfs.join(',')}`,
      `ufs=${ufsOut}`,
      `lote=${lote}`,
      'args<<EOF',
      args,
      'EOF',
      '',
    ].join('\n'),
  );
}
