import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseAllowedHmgUrl, TargetError } from './hmg-allowlist.mjs';
import {
  extractUfsFromSpec,
  summarizeReport,
} from './summarize-e2e-results.mjs';
import { describeLotes } from './uf-lotes.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const summarize = path.join(root, 'summarize-e2e-results.mjs');

function runSummary({ fixture, probeOutcome, e2eOutcome, extraEnv = {} }) {
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
      ...extraEnv,
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
assert.match(failed.markdown, /Falha de sincronização|Falha de locator|Falha funcional/);
assert.match(failed.markdown, /sintoma do teste/);
assert.match(failed.markdown, /### Flaky/);
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
  const merged = { ...process.env, ...env };
  if (!Object.prototype.hasOwnProperty.call(env, 'GITHUB_REF')) {
    delete merged.GITHUB_REF;
  }
  return spawnSync(process.execPath, [path.join(root, 'ci-select.mjs')], {
    encoding: 'utf8',
    env: merged,
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

const liveFeatureBranch = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_REF: 'refs/heads/feat/playwright-etapa-13-quality-audit',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
  PLAYWRIGHT_UFS: 'MA,TO',
});
assert.equal(liveFeatureBranch.status, 2, liveFeatureBranch.stderr || liveFeatureBranch.stdout);
assert.match(liveFeatureBranch.stderr || liveFeatureBranch.stdout, /restricted to refs\/heads\/main/);

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

const batch1 = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_UFS: 'AC,AP,DF,ES',
});
assert.equal(batch1.status, 0, batch1.stderr || batch1.stdout);
assert.match(batch1.stdout, /ac-estrutural\.spec\.ts/);
assert.match(batch1.stdout, /es-estrutural\.spec\.ts/);
assert.doesNotMatch(batch1.stdout, /ba-estrutural\.spec\.ts/);
assert.doesNotMatch(batch1.stdout, /registro\/ac\.spec\.ts/);

const unknownUf = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_UFS: 'SE',
});
assert.equal(unknownUf.status, 2, unknownUf.stderr || unknownUf.stdout);

const ufsOnRegression = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'regression',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_UFS: 'AC',
});
assert.equal(ufsOnRegression.status, 2, ufsOnRegression.stderr || ufsOnRegression.stdout);

const batch2 = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_UFS: 'MG,MS,MT,PB',
});
assert.equal(batch2.status, 0, batch2.stderr || batch2.stdout);
assert.match(batch2.stdout, /mg-estrutural\.spec\.ts/);
assert.match(batch2.stdout, /pb-estrutural\.spec\.ts/);
assert.match(batch2.stdout, /lote=batch-02/);
assert.doesNotMatch(batch2.stdout, /ba-estrutural\.spec\.ts/);
assert.doesNotMatch(batch2.stdout, /registro\/mg\.spec\.ts/);

const batch3 = runSelect({
  PLAYWRIGHT_MODE: 'mocked',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_UFS: 'PE,PR,RJ,RN',
});
assert.equal(batch3.status, 0, batch3.stderr || batch3.stdout);
assert.match(batch3.stdout, /pe-estrutural\.spec\.ts/);
assert.match(batch3.stdout, /pr-estrutural\.spec\.ts/);
assert.match(batch3.stdout, /rj-estrutural\.spec\.ts/);
assert.match(batch3.stdout, /rn-estrutural\.spec\.ts/);
assert.match(batch3.stdout, /lote=batch-03/);
assert.doesNotMatch(batch3.stdout, /ba-estrutural\.spec\.ts/);
assert.doesNotMatch(batch3.stdout, /registro\/pr\.spec\.ts/);

const accumulated = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
  PLAYWRIGHT_UFS: 'AC,AP,BA,CE,DF,ES,MG,MS,MT,PB,PE,PR,RJ,RN,RO',
});
assert.equal(accumulated.status, 0, accumulated.stderr || accumulated.stdout);
assert.match(accumulated.stdout, /rn-estrutural\.spec\.ts/);
assert.match(accumulated.stdout, /lote=baseline \+ batch-01 \+ batch-02 \+ batch-03/);
assert.doesNotMatch(accumulated.stdout, /registro\/rj\.spec\.ts/);
assert.doesNotMatch(accumulated.stdout, /sp-estrutural\.spec\.ts/);

const batch4 = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
  PLAYWRIGHT_UFS: 'RR,RS,SC,SP',
});
assert.equal(batch4.status, 0, batch4.stderr || batch4.stdout);
assert.match(batch4.stdout, /rr-estrutural\.spec\.ts/);
assert.match(batch4.stdout, /rs-estrutural\.spec\.ts/);
assert.match(batch4.stdout, /sc-estrutural\.spec\.ts/);
assert.match(batch4.stdout, /sp-estrutural\.spec\.ts/);
assert.match(batch4.stdout, /lote=batch-04/);
assert.doesNotMatch(batch4.stdout, /ba-estrutural\.spec\.ts/);
assert.doesNotMatch(batch4.stdout, /registro\/sp\.spec\.ts/);

const allStructural = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
});
assert.equal(allStructural.status, 0, allStructural.stderr || allStructural.stdout);
assert.match(allStructural.stdout, /mg-estrutural\.spec\.ts/);
assert.match(allStructural.stdout, /ba-estrutural\.spec\.ts/);
assert.match(allStructural.stdout, /sp-estrutural\.spec\.ts/);
assert.match(allStructural.stdout, /ma-estrutural\.spec\.ts/);
assert.match(allStructural.stdout, /to-estrutural\.spec\.ts/);
assert.match(allStructural.stdout, /lote=baseline \+ batch-01 \+ batch-02 \+ batch-03 \+ batch-04 \+ batch-05/);
assert.match(allStructural.stdout, /pe-estrutural\.spec\.ts/);
assert.doesNotMatch(allStructural.stdout, /registro\/ba\.spec\.ts/);
assert.doesNotMatch(allStructural.stdout, /registro\/to\.spec\.ts/);

const batch5 = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
  PLAYWRIGHT_UFS: 'MA,TO',
});
assert.equal(batch5.status, 0, batch5.stderr || batch5.stdout);
assert.match(batch5.stdout, /ma-estrutural\.spec\.ts/);
assert.match(batch5.stdout, /to-estrutural\.spec\.ts/);
assert.match(batch5.stdout, /lote=batch-05/);
assert.match(batch5.stdout, /--grep @live-readonly/);
assert.doesNotMatch(batch5.stdout, /ba-estrutural\.spec\.ts/);
assert.doesNotMatch(batch5.stdout, /registro\/to\.spec\.ts/);
assert.doesNotMatch(batch5.stdout, /@mocked/);

const accumulated21 = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'structural',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
  PLAYWRIGHT_UFS: 'AC,AP,BA,CE,DF,ES,MA,MG,MS,MT,PB,PE,PR,RJ,RN,RO,RR,RS,SC,SP,TO',
});
assert.equal(accumulated21.status, 0, accumulated21.stderr || accumulated21.stdout);
assert.match(accumulated21.stdout, /ma-estrutural\.spec\.ts/);
assert.match(accumulated21.stdout, /to-estrutural\.spec\.ts/);
assert.match(accumulated21.stdout, /lote=baseline \+ batch-01 \+ batch-02 \+ batch-03 \+ batch-04 \+ batch-05/);
assert.doesNotMatch(accumulated21.stdout, /registro\/ma\.spec\.ts/);

const liveSmoke = runSelect({
  PLAYWRIGHT_MODE: 'live-readonly',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  SUITE: 'smoke',
  PLAYWRIGHT_TARGET: 'newfront',
  PLAYWRIGHT_MASTER_USER: 'master',
  PLAYWRIGHT_MASTER_PASSWORD: 'secret',
});
assert.equal(liveSmoke.status, 0, liveSmoke.stderr || liveSmoke.stdout);
assert.match(liveSmoke.stdout, /ba-estrutural\.spec\.ts/);
assert.doesNotMatch(liveSmoke.stdout, /lote=smoke/);

const baSpec = {
  title: 'valida casca, linha de veículo, zero km e descarte sem Registrar',
  file: 'e2e/contratos/page02/ba-estrutural.spec.ts',
  parentTitles: ['PAGE-02 BA estrutura visual @contrato @page02 @ba @live-readonly'],
  tests: [{ status: 'expected', results: [{ status: 'passed' }] }],
};
assert.deepEqual(extractUfsFromSpec(baSpec), ['BA']);
assert.equal(describeLotes(['BA', 'CE', 'RO', 'AC', 'AP', 'DF', 'ES']), 'baseline + batch-01');
assert.equal(describeLotes(['MG', 'MS', 'MT', 'PB']), 'batch-02');

const sevenJson = JSON.parse(fs.readFileSync(path.join(root, 'testdata', 'structural-live-seven.json'), 'utf8'));
const seven = summarizeReport(sevenJson, {
  selectedUfs: ['AC', 'AP', 'BA', 'CE', 'DF', 'ES', 'RO'],
});
assert.deepEqual(seven.ufs.executed, ['AC', 'AP', 'BA', 'CE', 'DF', 'ES', 'RO']);
assert.deepEqual(seven.ufs.passed, ['AC', 'AP', 'BA', 'CE', 'DF', 'ES', 'RO']);
assert.equal(seven.passed, 7);
assert.equal(seven.failed, 0);
assert.deepEqual(seven.ufs.notRun, []);

const sevenSummary = runSummary({
  fixture: 'structural-live-seven.json',
  probeOutcome: 'success',
  e2eOutcome: 'success',
  extraEnv: {
    PLAYWRIGHT_MODE: 'live-readonly',
    SUITE: 'smoke',
    PLAYWRIGHT_SELECTED_UFS: 'AC,AP,BA,CE,DF,ES,RO',
    PLAYWRIGHT_LOTE: 'baseline + batch-01',
  },
});
assert.match(sevenSummary.markdown, /UFs executadas: AC, AP, BA, CE, DF, ES, RO/);
assert.match(sevenSummary.markdown, /UFs aprovadas: AC, AP, BA, CE, DF, ES, RO/);
assert.match(sevenSummary.markdown, /Lote: baseline \+ batch-01/);
assert.doesNotMatch(sevenSummary.markdown, /Lote: smoke/);

const partialJson = JSON.parse(fs.readFileSync(path.join(root, 'testdata', 'structural-partial.json'), 'utf8'));
const partial = summarizeReport(partialJson, { selectedUfs: ['MG', 'MS', 'MT', 'PB'] });
assert.deepEqual(partial.ufs.passed, ['MG']);
assert.deepEqual(partial.ufs.failed, ['MS']);
assert.deepEqual(partial.ufs.skipped, ['MT']);
assert.deepEqual(partial.ufs.flaky, ['PB']);
assert.deepEqual(partial.ufs.executed, ['MG', 'MS', 'PB']);
assert.deepEqual(partial.ufs.notRun, []);
assert.equal(partial.failures[0].kind, 'falha-locator');

const repoRoot = path.join(root, '..');
const gates = spawnSync(process.execPath, [path.join(root, 'quality-gates.mjs')], {
  cwd: repoRoot,
  encoding: 'utf8',
  env: { ...process.env, PLAYWRIGHT_MODE: 'mocked' },
});
assert.equal(gates.status, 0, gates.stderr || gates.stdout);
assert.match(gates.stdout, /gate-6-live/);
assert.match(gates.stdout, /LIVE_PENDING/);

console.log('validate-pipeline-local: canários locais aprovados');
