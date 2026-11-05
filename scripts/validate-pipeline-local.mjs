import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseAllowedHmgUrl, TargetError } from './hmg-allowlist.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const summarize = path.join(root, 'summarize-e2e-results.mjs');

function runSummary({ fixture, probeOutcome, e2eOutcome }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-pipeline-'));
  fs.mkdirSync(path.join(dir, 'test-results'), { recursive: true });
  if (fixture) {
    fs.copyFileSync(path.join(root, 'testdata', fixture), path.join(dir, 'test-results', 'e2e-results.json'));
  }

  const result = spawnSync(process.execPath, [summarize], {
    cwd: dir,
    env: {
      ...process.env,
      GITHUB_OUTPUT: path.join(dir, 'github-output.txt'),
      PROBE_OUTCOME: probeOutcome,
      E2E_OUTCOME: e2eOutcome,
      APP_VERSION: '1.2.3-canario',
      GIT_SHA: 'abc1234',
      DEPLOY_ID: 'deploy-local',
      SUITE: 'smoke',
      PLAYWRIGHT_NEWFRONT_URL: 'https://newfront.vbconnection.info',
    },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const previous = process.cwd();
  process.chdir(dir);
  try {
    return {
      markdown: fs.readFileSync('test-results/e2e-summary.md', 'utf8'),
      output: fs.readFileSync('github-output.txt', 'utf8'),
    };
  } finally {
    process.chdir(previous);
  }
}

function expectDenied(url) {
  assert.throws(() => parseAllowedHmgUrl(url), TargetError);
}

parseAllowedHmgUrl('https://newfront.vbconnection.info');
parseAllowedHmgUrl('https://newfront.vbconnection.info/');
parseAllowedHmgUrl('https://hmg.vbconnection.info');
parseAllowedHmgUrl('https://hmg.vbconnection.info/');
expectDenied('http://newfront.vbconnection.info');
expectDenied('http://hmg.vbconnection.info');
expectDenied('https://prd.vbconnection.info');
expectDenied('https://localhost:8080');
expectDenied('https://user:secret@newfront.vbconnection.info');
expectDenied('https://newfront.vbconnection.info/?q=1');

const passed = runSummary({
  fixture: 'passed.json',
  probeOutcome: 'success',
  e2eOutcome: 'success',
});
assert.match(passed.markdown, /testes concluídos sem falhas/);
assert.match(passed.markdown, /Aprovados \| 3/);
assert.match(passed.markdown, /Ignorados \| 1/);
assert.match(passed.output, /classification=testes-aprovados/);

const failed = runSummary({
  fixture: 'failed.json',
  probeOutcome: 'success',
  e2eOutcome: 'failure',
});
assert.match(failed.markdown, /testes concluídos com falhas/);
assert.match(failed.markdown, /Reprovados \| 1/);
assert.match(failed.markdown, /VA-1774 abre o formulário de registro a partir da home/);
assert.match(failed.output, /classification=testes-reprovados/);

const infra = runSummary({
  fixture: '',
  probeOutcome: 'skipped',
  e2eOutcome: 'skipped',
});
assert.match(infra.markdown, /falha de infraestrutura da pipeline/);
assert.match(infra.output, /classification=falha-infraestrutura/);

const unavailable = runSummary({
  fixture: '',
  probeOutcome: 'failure',
  e2eOutcome: 'skipped',
});
assert.match(unavailable.markdown, /aplicação HMG indisponível/);
assert.match(unavailable.output, /classification=aplicacao-indisponivel/);

function runSelect(env) {
  return spawnSync(process.execPath, [path.join(root, 'ci-select.mjs')], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

const prLive = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'pull_request',
  SUITE: 'smoke',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: '',
  PLAYWRIGHT_MASTER_PASSWORD: '',
});
assert.equal(prLive.status, 2, prLive.stderr || prLive.stdout);

const hmg = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'smoke',
  PLAYWRIGHT_TARGET: 'hmg',
});
assert.equal(hmg.status, 2, hmg.stderr || hmg.stdout);

const mockedOk = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'pull_request',
  SUITE: 'regression',
  PLAYWRIGHT_TARGET: 'newfront',
});
assert.equal(mockedOk.status, 0, mockedOk.stderr || mockedOk.stdout);
assert.match(mockedOk.stdout, /grep-invert @live-readonly/);

console.log('validate-pipeline-local: canários locais aprovados');
