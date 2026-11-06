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

function stripAnsi(text) {
  return String(text || '').replace(/\u001b\[[0-9;]*m/g, '');
}

function firstError(result) {
  const error = result?.error || (result?.errors || [])[0];
  if (!error) return { message: '', stack: '' };
  const raw = stripAnsi(String(error.message || error));
  const preview = raw.split('\n').slice(0, 8).join(' ');
  return {
    message: sanitizeReportText(preview),
    stack: sanitizeReportText(stripAnsi(String(error.stack || ''))),
  };
}

export function sanitizeReportText(text) {
  return String(text || '')
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer [REDACTED]')
    .replace(/([?&](token|access_token|password|senha)=)[^&\s]+/gi, '$1[REDACTED]')
    .replace(
      /"(access_token|refresh_token|token|password|senha|cookie|authorization)"\s*:\s*"[^"]*"/gi,
      '"$1":"[REDACTED]"',
    )
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]');
}

const UF_TOKEN = /\b(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MG|MS|MT|PA|PB|PE|PI|PR|RJ|RN|RO|RR|RS|SC|SE|SP|TO)\b/g;

export function extractUfsFromSpec(spec) {
  const annotations = (spec.tests || [])
    .flatMap((item) => item.annotations || [])
    .map((item) => item.description || '')
    .join(' ');
  const hay = `${spec.title || ''} ${spec.file || ''} ${annotations}`;
  return [...new Set([...hay.matchAll(UF_TOKEN)].map((match) => match[1]))];
}

export function classifyFailureKind(message = '', spec = {}) {
  const msg = stripAnsi(String(message || '')).toLowerCase();
  const title = String(spec.title || '').toLowerCase();
  const hay = `${msg} ${title}`;
  if (/skip|ignorad|gate \d live exige|piloto live-readonly exige/.test(hay)) {
    return 'teste-ignorado-regra';
  }
  if (/master|autentica|401|login|password expir|duas etapas|prefs2|credentials/.test(hay)) {
    return 'falha-autenticacao';
  }
  if (/net::err|econnrefused|enotfound|502|503|504|chromium|browser closed|enospc|target closed/.test(hay)) {
    return 'falha-infraestrutura';
  }
  if (/hmg is not authorized|institucional|aplicação .*indispon/.test(hay)) {
    return 'falha-ambiente';
  }
  if (/tohaveurl|waiting for navigation|carregando configuração|overlay|timeout \d+ms exceeded/.test(hay) && /url|navigat|home/.test(hay)) {
    return 'falha-sincronizacao';
  }
  if (/strict mode violation|resolved to \d+ elements|getbyrole|locator\(|tobevisible|tohavecount/.test(hay)) {
    return 'falha-locator';
  }
  if (/expect\(|tohave|toequal|tocontain|assertion/.test(hay)) {
    return 'falha-funcional';
  }
  return 'falha-nao-classificada';
}

function failureKindLabel(kind) {
  switch (kind) {
    case 'falha-funcional':
      return 'Falha funcional';
    case 'falha-locator':
      return 'Falha de locator';
    case 'falha-autenticacao':
      return 'Falha de autenticação';
    case 'falha-ambiente':
      return 'Falha de ambiente';
    case 'falha-infraestrutura':
      return 'Falha de infraestrutura';
    case 'falha-sincronizacao':
      return 'Falha de sincronização';
    case 'teste-ignorado-regra':
      return 'Teste ignorado por regra conhecida';
    default:
      return 'Falha não classificada (sintoma do teste, não veredito de produto)';
  }
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
      const kind = classifyFailureKind(error.message, spec);
      return {
        title: titleOf(spec),
        file: locationOf(spec),
        project: test.projectName || '',
        durationMs: result?.duration ?? 0,
        message: error.message,
        stack: error.stack,
        ufs: extractUfsFromSpec(spec),
        kind,
        kindLabel: failureKindLabel(kind),
      };
    }),
    flakyDetails: buckets.flaky.map(({ spec, test }) => {
      const first = (test.results || []).find((item) => item.status === 'failed' || item.status === 'timedOut');
      const error = firstError(first);
      const kind = classifyFailureKind(error.message, spec);
      return {
        title: titleOf(spec),
        file: locationOf(spec),
        ufs: extractUfsFromSpec(spec),
        kind,
        kindLabel: failureKindLabel(kind),
        message: error.message,
      };
    }),
    ufs: [...new Set(specs.flatMap((spec) => extractUfsFromSpec(spec)))].sort(),
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
        .map(
          (item) =>
            `- **${item.kindLabel}** — ${item.title} — ${item.file}${item.ufs?.length ? ` — UF ${item.ufs.join(', ')}` : ''}${item.message ? ` — ${item.message}` : ''}`,
        )
        .join('\n')
    : '- Nenhuma falha registrada nesta execução.';

  const flakyLines = (metrics.flakyDetails || []).length
    ? metrics.flakyDetails
        .map(
          (item) =>
            `- **${item.kindLabel}** — ${item.title} — ${item.file}${item.message ? ` — 1ª falha: ${item.message}` : ''}`,
        )
        .join('\n')
    : '- Nenhum teste passou apenas após retry.';

  const artifact = meta.runId
    ? `playwright-${meta.runId}-${meta.mode}-${meta.suite}`
    : 'n/d (execução local)';

  return [
    '**VBConnection — Resultado da Automação**',
    '',
    `Versão: ${meta.version}`,
    '',
    `Ambiente: ${meta.environment}`,
    '',
    `Commit: ${meta.sha}`,
    '',
    `Branch: ${meta.branch}`,
    '',
    `Deploy: ${meta.deployId}`,
    '',
    `Modo: ${meta.mode}`,
    '',
    `Suíte: ${meta.suite}`,
    '',
    `Lote: ${meta.lote || 'n/d'}`,
    '',
    `UFs selecionadas: ${meta.ufsSelecionadas || 'n/d'}`,
    '',
    `UFs executadas: ${metrics.ufs?.length ? metrics.ufs.join(', ') : 'n/d'}`,
    '',
    `Alvo: ${meta.target}`,
    '',
    `Run ID: ${meta.runId || 'local'}`,
    '',
    `Artifact: ${artifact}`,
    '',
    `Segurança: ${meta.securityStatus || 'n/d'}`,
    '',
    `Persistência: ${meta.persistStatus || 'n/d'}`,
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
    '_A classificação das falhas descreve o **sintoma do teste** (locator, sync, auth, ambiente, infra, funcional). Não é veredito automático de defeito de produto._',
    '',
    '### Falhas',
    '',
    failureLines,
    '',
    '### Flaky',
    '',
    flakyLines,
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
        flakyDetails: [],
        ufs: [],
      };

  const markdown = renderSummary({
    metrics,
    meta: {
      version: process.env.APP_VERSION || 'não informada',
      environment:
        process.env.PLAYWRIGHT_MODE === 'live-readonly'
          ? 'live-readonly / newfront'
          : 'mocked / newfront SPA harness',
      sha: process.env.GIT_SHA || process.env.GITHUB_SHA || 'local',
      branch: process.env.GITHUB_REF_NAME || process.env.GITHUB_HEAD_REF || 'local',
      deployId: process.env.DEPLOY_ID || 'não informado',
      mode: process.env.PLAYWRIGHT_MODE || 'mocked',
      suite: process.env.SUITE || 'n/d',
      lote: process.env.PLAYWRIGHT_UFS === 'AC,AP,DF,ES' ? '01' : process.env.PLAYWRIGHT_UFS === 'BA,CE,RO' ? 'baseline' : process.env.SUITE || 'n/d',
      ufsSelecionadas: process.env.PLAYWRIGHT_UFS || 'todas as estruturais implementadas',
      runId: process.env.GITHUB_RUN_ID || '',
      target:
        process.env.PLAYWRIGHT_TARGET_URL ||
        process.env.PLAYWRIGHT_NEWFRONT_URL ||
        'https://newfront.vbconnection.info',
      securityStatus:
        process.env.PLAYWRIGHT_MODE === 'live-readonly'
          ? 'Environment live-readonly · workers=1 · snapshots sanitizados · credencial Master não logada'
          : 'mocked · sem credencial Master',
      persistStatus:
        process.env.PLAYWRIGHT_MODE === 'live-readonly'
          ? 'persistGuard live-readonly (mutações /api/ abortadas; limites: WS, form nativo, outro context)'
          : 'persistGuard mocked (registrar cai no mock)',
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
