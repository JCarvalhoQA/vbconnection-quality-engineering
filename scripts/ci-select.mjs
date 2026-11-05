/**
 * Validates PLAYWRIGHT_MODE / SUITE / PLAYWRIGHT_TARGET and prints Playwright args.
 * Pull requests cannot select live-readonly. Target hmg is rejected (institutional site).
 */
import { appendFileSync } from 'node:fs';

const mode = process.env.PLAYWRIGHT_MODE || 'mocked';
const suite = process.env.SUITE || 'smoke';
const target = process.env.PLAYWRIGHT_TARGET || 'newfront';
const eventName = process.env.GITHUB_EVENT_NAME || '';

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(2);
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

const project = 'vbconnection-newfront';
let args = `--project=${project}`;

if (mode === 'mocked') {
  if (suite === 'smoke') {
    args += ' --grep @smoke --grep-invert @live-readonly';
  } else if (suite === 'regression') {
    args += ' --grep-invert @live-readonly';
  } else {
    args += ' e2e/contratos/page02 --grep @mocked';
  }
} else if (suite === 'regression') {
  args += ' --grep @live-readonly';
} else {
  args += ' e2e/contratos/page02 --grep @live-readonly';
}

console.log(`project=${project}`);
console.log(`args=${args}`);
console.log(`mode=${mode}`);
console.log(`suite=${suite}`);
console.log(`target=${target}`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `project=${project}`,
      `mode=${mode}`,
      `suite=${suite}`,
      `target=${target}`,
      'args<<EOF',
      args,
      'EOF',
      '',
    ].join('\n'),
  );
}
