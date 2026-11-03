import fs from 'node:fs';
import path from 'node:path';

function readJson() {
  if (!fs.existsSync('test-results/e2e-results.json')) return null;
  return JSON.parse(fs.readFileSync('test-results/e2e-results.json', 'utf8'));
}

function collectSpecs(suite, acc = []) {
  for (const spec of suite.specs || []) acc.push(spec);
  for (const child of suite.suites || []) collectSpecs(child, acc);
  return acc;
}

function lastResult(test) {
  const results = Array.isArray(test.results) ? test.results : [];
  return results.length ? results[results.length - 1] : null;
}

function classifySpec(spec) {
  const test = (spec.tests || [])[0] || {};
  const status = test.status || (spec.ok ? 'expected' : 'unexpected');
  const result = lastResult(test);
  const resultStatus = result?.status;

  if (status === 'skipped' || resultStatus === 'skipped') {
    return { bucket: 'skipped', test, result };
  }
  if (status === 'flaky') {
    return { bucket: 'flaky', test, result };
  }
  if (resultStatus === 'interrupted' || (!result && status !== 'expected')) {
    return { bucket: 'notRun', test, result };
  }
  if (status === 'unexpected' || resultStatus === 'failed' || resultStatus === 'timedOut') {
    return { bucket: 'failed', test, result };
  }
  if (status === 'expected' || resultStatus === 'passed' || spec.ok) {
    return { bucket: 'passed', test, result };
  }
  return { bucket: 'notRun', test, result };
}

function titleOf(spec) {
  return spec.title || '(sem título)';
}

function locationOf(spec) {
  const file = spec.file || spec.location?.file || '';
  const line = spec.line || spec.location?.line;
  return line ? `${file}:${line}` : file;
}

function firstError(result) {
  const error = result?.error || (result?.errors || [])[0];
  if (!error) return { message: '', stack: '' };
  return {
    message: String(error.message || error).split('\n')[0],
    stack: String(error.stack || ''),
  };
}

function percent(part, whole) {
  if (!whole) return 'n/d';
  return `${((part / whole) * 100).toFixed(2).replace('.', ',')}%`;
}

function classifyRun({ json, probeOutcome, e2eOutcome }) {
  if (probeOutcome === 'failure') return 'aplicacao-indisponivel';
  if (e2eOutcome === 'cancelled' || probeOutcome === 'cancelled') return 'cancelado';
  if (probeOutcome === 'skipped' && !json) return 'falha-infraestrutura';
  if (!json && e2eOutcome === 'failure') return 'falha-infraestrutura';
  if (!json) return 'nao-executado';
  const unexpected = json.stats?.unexpected ?? 0;
  if (unexpected > 0) return 'testes-reprovados';
  if (e2eOutcome === 'failure') return 'testes-reprovados';
  return 'testes-aprovados';
}

function statusLabel(classification) {
  switch (classification) {
    case 'testes-aprovados':
      return 'testes concluídos sem falhas';
    case 'testes-reprovados':
      return 'testes concluídos com falhas';
    case 'aplicacao-indisponivel':
      return 'aplicação HMG indisponível';
    case 'falha-infraestrutura':
      return 'falha de infraestrutura da pipeline';
    case 'cancelado':
      return 'execução cancelada';
    default:
      return 'suíte não executada';
  }
}

export function summarizeReport(json) {
  const specs = (json?.suites || []).flatMap((suite) => collectSpecs(suite));
  const buckets = { passed: [], failed: [], skipped: [], flaky: [], notRun: [] };

  for (const spec of specs) {
    const classified = classifySpec(spec);
    buckets[classified.bucket].push({ spec, ...classified });
  }

  const stats = json?.stats || {};
  const passed = stats.expected ?? buckets.passed.length;
  const failed = stats.unexpected ?? buckets.failed.length;
  const skipped = stats.skipped ?? buckets.skipped.length;
  const flaky = stats.flaky ?? buckets.flaky.length;
  const notRun = buckets.notRun.length;
  const total = passed + failed + skipped + flaky + notRun;
  const executed = passed + failed + flaky;
  const approved = passed + flaky;

  return {
    passed,
    failed,
    skipped,
    flaky,
    notRun,
    total,
    executed,
    approved,
    durationMs: stats.duration ?? 0,
    startTime: stats.startTime || '',
    passRate: percent(approved, executed),
    failures: buckets.failed.map(({ spec, test, result }) => {
      const error = firstError(result);
      return {
        title: titleOf(spec),
        file: locationOf(spec),
        project: test.projectName || '',
        durationMs: result?.duration ?? 0,
        message: error.message,
        stack: error.stack,
      };
    }),
  };
}

function markdownTable(rows) {
  const header = '| Métrica | Resultado |\n|---|---|';
  const body = rows.map(([metric, value]) => `| ${metric} | ${value} |`).join('\n');
  return `${header}\n${body}`;
}

function formatDuration(ms) {
  if (!ms) return 'n/d';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest}s`;
}

export function renderSummary({ metrics, meta }) {
  const failureLines = metrics.failures.length
    ? metrics.failures
        .map((item) => `- ${item.title} — ${item.file}${item.message ? ` — ${item.message}` : ''}`)
        .join('\n')
    : '- Nenhuma falha funcional registrada nesta execução.';

  return [
    '**VBConnection — Resultado da Automação**',
    '',
    `Versão: ${meta.version}`,
    '',
    `Ambiente: ${meta.environment}`,
    '',
    `Commit: ${meta.sha}`,
    '',
    `Deploy: ${meta.deployId}`,
    '',
    `Suíte: ${meta.suite}`,
    '',
    `Alvo: ${meta.target}`,
    '',
    `Status geral: ${meta.statusLabel}`,
    '',
    markdownTable([
      ['Total', String(metrics.total)],
      ['Aprovados', String(metrics.passed)],
      ['Reprovados', String(metrics.failed)],
      ['Ignorados', String(metrics.skipped)],
      ['Flaky (passou após retry)', String(metrics.flaky)],
      ['Não executados', String(metrics.notRun)],
      ['Duração', formatDuration(metrics.durationMs)],
      ['Taxa de aprovação', metrics.passRate],
    ]),
    '',
    '_Taxa de aprovação = (aprovados + flaky) / (aprovados + reprovados + flaky). Ignorados e não executados ficam fora do denominador._',
    '',
    '### Falhas',
    '',
    failureLines,
    '',
  ].join('\n');
}

function writeSummary(content) {
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync('test-results/e2e-summary.md', content, 'utf8');
}

function main() {
  const json = readJson();
  const probeOutcome = process.env.PROBE_OUTCOME || 'success';
  const e2eOutcome = process.env.E2E_OUTCOME || (json ? 'success' : 'failure');
  const classification = classifyRun({ json, probeOutcome, e2eOutcome });
  const metrics = json
    ? summarizeReport(json)
    : {
        passed: 0,
        failed: 0,
        skipped: 0,
        flaky: 0,
        notRun: 0,
        total: 0,
        executed: 0,
        approved: 0,
        durationMs: 0,
        startTime: '',
        passRate: 'n/d',
        failures: [],
      };

  const markdown = renderSummary({
    metrics,
    meta: {
      version: process.env.APP_VERSION || 'não informada',
      environment: 'HMG',
      sha: process.env.GIT_SHA || process.env.GITHUB_SHA || 'local',
      deployId: process.env.DEPLOY_ID || 'não informado',
      suite: process.env.SUITE || 'n/d',
      target:
        process.env.PLAYWRIGHT_TARGET_URL ||
        process.env.PLAYWRIGHT_NEWFRONT_URL ||
        'https://newfront.vbconnection.info',
      statusLabel: statusLabel(classification),
    },
  });

  writeSummary(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, 'utf8');
  }
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `classification=${classification}\n`, 'utf8');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `failed=${metrics.failed}\n`, 'utf8');
  }

  console.log('Resumo gravado em test-results/e2e-summary.md');
  console.log(`classification=${classification} failed=${metrics.failed} skipped=${metrics.skipped}`);
}

const isDirectRun = pathToFileURLIfNeeded();
if (isDirectRun) {
  main();
}

function pathToFileURLIfNeeded() {
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : '';
  return invoked === path.resolve('scripts/summarize-e2e-results.mjs')
    || invoked.endsWith(`${path.sep}summarize-e2e-results.mjs`);
}
