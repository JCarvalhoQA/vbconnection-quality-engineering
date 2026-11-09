/**
 * Quality Gates 1–6 do harness PAGE-02.
 * Gates de desenvolvimento não exigem credencial Master e não bloqueiam deploy do produto.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { STRUCTURAL_UFS_IMPLEMENTED } from './uf-lotes.mjs';
import { buildUfQualityIndicators, renderUfQualityMarkdown } from './uf-quality-indicators.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function failCheck(id, message) {
  return { id, ok: false, message };
}

function passCheck(id, message) {
  return { id, ok: true, message };
}

function gate1ProjectIntegrity() {
  const checks = [];
  const config = read('playwright.config.ts');
  checks.push(
    /workers:\s*liveReadonly\s*\?\s*1/.test(config)
      ? passCheck('live-workers-1', 'playwright.config.ts usa workers=1 no live.')
      : failCheck('live-workers-1', 'playwright.config.ts não força workers=1 no live.'),
  );
  checks.push(
    /retries:\s*liveReadonly\s*\?\s*0/.test(config)
      ? passCheck('live-retries-0', 'playwright.config.ts usa retries=0 no live.')
      : failCheck('live-retries-0', 'playwright.config.ts não força retries=0 no live.'),
  );
  checks.push(
    /fullyParallel:\s*!liveReadonly/.test(config)
      ? passCheck('live-serial', 'playwright.config.ts desliga fullyParallel no live.')
      : failCheck('live-serial', 'playwright.config.ts não serializa o live.'),
  );
  checks.push(
    /trace:\s*liveReadonly\s*\?\s*'off'/.test(config)
      ? passCheck('live-trace-off', 'Trace desligado no live.')
      : failCheck('live-trace-off', 'Trace live não está off.'),
  );
  checks.push(
    exists('support/persistGuard.ts')
      ? passCheck('persist-guard', 'persistGuard.ts presente.')
      : failCheck('persist-guard', 'persistGuard.ts ausente.'),
  );
  checks.push(
    read('support/liveInspect.ts').includes('AUTH_PASSWORD_EXPIRED')
      ? passCheck('auth-expired', 'AUTH_PASSWORD_EXPIRED preservado.')
      : failCheck('auth-expired', 'AUTH_PASSWORD_EXPIRED ausente.'),
  );
  checks.push(
    exists('fixtures/matriz/MA.json')
      ? failCheck('ma-java', 'fixtures/matriz/MA.json existe — matriz Java artificial de MA.')
      : passCheck('ma-java', 'MA sem fixture Java artificial.'),
  );

  const missingSpecs = STRUCTURAL_UFS_IMPLEMENTED.filter(
    (uf) => !exists(`e2e/contratos/page02/${uf.toLowerCase()}-estrutural.spec.ts`),
  );
  checks.push(
    missingSpecs.length === 0 && STRUCTURAL_UFS_IMPLEMENTED.length === 21
      ? passCheck('specs-21', '21 specs estruturais presentes.')
      : failCheck('specs-21', `Specs estruturais incompletas: ${missingSpecs.join(',') || 'allowlist ≠ 21'}`),
  );

  const trackedEnv = spawnSync('git', ['ls-files', '.env', '.env.local', 'credentials.json'], {
    cwd: root,
    encoding: 'utf8',
  });
  const tracked = (trackedEnv.stdout || '').trim();
  checks.push(
    tracked
      ? failCheck('no-secrets', `Arquivo sensível versionado: ${tracked}`)
      : passCheck('no-secrets', 'Nenhum .env/credentials.json versionado.'),
  );

  return { id: 'gate-1-integridade', title: 'Integridade do projeto', checks };
}

function gate2UnitContract() {
  const checks = [];
  const mutation = read('tests/structuralMutation.test.ts');
  checks.push(
    mutation.includes('expect(score.survived).toBe(0)') &&
      mutation.includes('expect(score.detected).toBe(420)') &&
      mutation.includes('expect(score.invalid).toBe(42)')
      ? passCheck('mutation-contract', 'Contrato unitário de mutation 420/0/42 presente.')
      : failCheck('mutation-contract', 'Contrato de mutation score ausente ou alterado sem evidência.'),
  );
  checks.push(
    exists('tests/persistGuard.test.ts')
      ? passCheck('persist-unit', 'Testes de persistGuard presentes.')
      : failCheck('persist-unit', 'tests/persistGuard.test.ts ausente.'),
  );
  checks.push(
    exists('tests/validatePipeline.test.ts')
      ? passCheck('pipeline-unit', 'Canário de pipeline presente.')
      : failCheck('pipeline-unit', 'tests/validatePipeline.test.ts ausente.'),
  );
  return { id: 'gate-2-unitarios', title: 'Unitários (contrato)', checks };
}

function gate3Matriz() {
  const checks = [];
  const comparePath = path.join(root, 'docs', 'qa-mapping', 'evidence', 'mock-vs-java.json');
  if (!fs.existsSync(comparePath)) {
    return {
      id: 'gate-3-matriz',
      title: 'Matriz UI/Java',
      checks: [failCheck('matriz-json', 'mock-vs-java.json ausente.')],
    };
  }
  const matriz = JSON.parse(fs.readFileSync(comparePath, 'utf8'));
  checks.push(
    matriz.mismatch_count === 0
      ? passCheck('mismatch-0', 'mismatch_count=0.')
      : failCheck('mismatch-0', `mismatch_count=${matriz.mismatch_count}`),
  );
  checks.push(
    matriz.missing_in_mock === 0
      ? passCheck('missing-0', 'missing_in_mock=0.')
      : failCheck('missing-0', `missing_in_mock=${matriz.missing_in_mock}`),
  );
  checks.push(
    Array.isArray(matriz.pw_only) && matriz.pw_only.includes('SE')
      ? passCheck('se-pw-only', 'SE permanece pw_only / fora da matriz Java.')
      : failCheck('se-pw-only', 'SE não está em pw_only.'),
  );
  checks.push(
    Array.isArray(matriz.overlap) && !matriz.overlap.includes('MA')
      ? passCheck('ma-fora-overlap', 'MA fora do overlap Java (lacuna preservada).')
      : failCheck('ma-fora-overlap', 'MA entrou no overlap Java — verificar fixture artificial.'),
  );
  return { id: 'gate-3-matriz', title: 'Matriz UI/Java', checks };
}

function gate4MockedRegression() {
  if (process.env.PLAYWRIGHT_MODE === 'live-readonly') {
    return {
      id: 'gate-4-mocked',
      title: 'Regressão mocked',
      checks: [
        passCheck(
          'mocked-not-in-live-job',
          'Job live não avalia regressão mocked; isso permanece no job mocked/PR.',
        ),
      ],
      skipped: true,
    };
  }
  const required = process.env.QUALITY_GATES_REQUIRE_E2E === '1';
  const resultsPath = path.join(root, 'test-results', 'e2e-results.json');
  if (!fs.existsSync(resultsPath)) {
    return {
      id: 'gate-4-mocked',
      title: 'Regressão mocked',
      checks: [
        required
          ? failCheck('mocked-results', 'QUALITY_GATES_REQUIRE_E2E=1 e e2e-results.json ausente.')
          : passCheck(
              'mocked-pending',
              'e2e-results.json ausente neste passo — Gate 4 fica a cargo da suíte mocked.',
            ),
      ],
      skipped: !required,
    };
  }
  if (!required) {
    return {
      id: 'gate-4-mocked',
      title: 'Regressão mocked',
      checks: [
        passCheck(
          'mocked-deferred',
          'Resultados e2e presentes, mas Gate 4 só falha o job quando QUALITY_GATES_REQUIRE_E2E=1.',
        ),
      ],
      skipped: true,
    };
  }
  const json = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const stats = json.stats || {};
  const unexpected = stats.unexpected ?? stats.failed ?? 0;
  const checks = [
    unexpected === 0
      ? passCheck('mocked-no-fail', `Nenhuma falha definitiva (unexpected=${unexpected}).`)
      : failCheck('mocked-no-fail', `Falhas definitivas: unexpected=${unexpected}`),
  ];
  return { id: 'gate-4-mocked', title: 'Regressão mocked', checks };
}

function gate5Mutation() {
  const checks = [];
  const mutation = read('support/structuralMutation.ts');
  checks.push(
    mutation.includes('mockedOracleFindings') && mutation.includes('liveOracleFindings')
      ? passCheck('oracle-presente', 'Oráculos live e mocked presentes.')
      : failCheck('oracle-presente', 'Oráculos de mutação ausentes.'),
  );
  checks.push(
    read('tests/structuralMutation.test.ts').includes("expect(score.score).toBe(1)")
      ? passCheck('score-1', 'Teste exige mutation score 1.00 do catálogo atual.')
      : failCheck('score-1', 'Teste de score 1.00 ausente.'),
  );
  return { id: 'gate-5-mutation', title: 'Mutation testing', checks };
}

function gate6LiveReadonly() {
  const yaml = read('.github/workflows/playwright-tests.yml');
  const select = read('scripts/ci-select.mjs');
  const checks = [];
  checks.push(
    yaml.includes("github.event_name == 'workflow_dispatch' && inputs.mode == 'live-readonly' && github.ref == 'refs/heads/main'")
      ? passCheck('live-main-only', 'Job live só dispara na main via workflow_dispatch.')
      : failCheck('live-main-only', 'Restrição live→main ausente no YAML.'),
  );
  checks.push(
    /environment:\s*live-readonly/.test(yaml)
      ? passCheck('environment', 'Environment live-readonly exigido.')
      : failCheck('environment', 'Environment live-readonly ausente.'),
  );
  checks.push(
    yaml.includes('--workers=1 --retries=0')
      ? passCheck('cli-serial', 'CLI live força workers=1 retries=0.')
      : failCheck('cli-serial', 'CLI live sem workers=1/retries=0.'),
  );
  checks.push(
    yaml.includes('sanitize-live-artifacts.mjs')
      ? passCheck('sanitize', 'Sanitização de artifacts live presente.')
      : failCheck('sanitize', 'sanitize-live-artifacts ausente no job live.'),
  );
  checks.push(
    yaml.includes('# Sem trace.zip/video')
      ? passCheck('no-trace-upload', 'Upload live não inclui trace/vídeo.')
      : failCheck('no-trace-upload', 'Comentário/restrição de trace live ausente.'),
  );
  checks.push(
    select.includes("ref !== 'refs/heads/main'")
      ? passCheck('ci-select-main', 'ci-select.mjs restringe live à main.')
      : failCheck('ci-select-main', 'ci-select.mjs sem restrição à main.'),
  );
  checks.push(
    yaml.includes("github.event_name == 'pull_request'") &&
      yaml.includes("inputs.mode != 'live-readonly'")
      ? passCheck('pr-mocked-only', 'PR executa mocked e não live.')
      : failCheck('pr-mocked-only', 'Separação PR mocked / live não encontrada.'),
  );
  return { id: 'gate-6-live', title: 'Live-readonly', checks };
}

export function runQualityGates() {
  const gates = [
    gate1ProjectIntegrity(),
    gate2UnitContract(),
    gate3Matriz(),
    gate4MockedRegression(),
    gate5Mutation(),
    gate6LiveReadonly(),
  ];
  const indicators = buildUfQualityIndicators();
  const failed = gates.flatMap((gate) => gate.checks.filter((check) => !check.ok));
  const ok = failed.length === 0;
  return { ok, failed, gates, indicators };
}

function renderGatesMarkdown(report) {
  const rows = report.gates.map((gate) => {
    const failed = gate.checks.filter((check) => !check.ok);
    const status = gate.skipped ? 'SKIPPED' : failed.length ? 'FAIL' : 'PASS';
    return [gate.id, gate.title, status, String(gate.checks.length - failed.length), String(failed.length)];
  });
  return [
    '### Quality Gates',
    '',
    '| Gate | Título | Status | Checks ok | Falhas |',
    '|---|---|---|---:|---:|',
    ...rows.map((row) => `| ${row.join(' | ')} |`),
    '',
    report.ok
      ? 'Gates de desenvolvimento aprovados. Live acumulado e MA/TO continuam PENDING quando o catálogo live não cobre o SHA atual.'
      : `Gates reprovados: ${report.failed.map((item) => item.id).join(', ')}`,
    '',
    renderUfQualityMarkdown(report.indicators),
  ].join('\n');
}

function main() {
  const report = runQualityGates();
  const outDir = path.join(root, 'test-results');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'uf-quality-indicators.json'),
    `${JSON.stringify(report.indicators, null, 2)}\n`,
    'utf8',
  );
  const markdown = renderGatesMarkdown(report);
  fs.writeFileSync(path.join(outDir, 'quality-gates.md'), markdown, 'utf8');
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`, 'utf8');
  }
  console.log(markdown);
  if (!report.ok) {
    for (const item of report.failed) {
      console.error(`::error::${item.id}: ${item.message}`);
    }
    process.exit(1);
  }
}

const invoked = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invoked === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
