/**
 * Indicadores PAGE-02 derivados de inventário, allowlist, matriz e catálogo live.
 * Não inventa aprovação live do SHA atual.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STRUCTURAL_UFS_IMPLEMENTED } from './uf-lotes.mjs';
import { extractUfsFromSpec } from './summarize-e2e-results.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const INVENTORY_PATH = path.join(root, 'docs', 'qa-mapping', 'etapa-5', 'LIVE-FIELD-INVENTORY.json');
const LIVE_RUNS_PATH = path.join(root, 'docs', 'qa-mapping', 'evidence', 'live-uf-runs.json');
const MATRIZ_COMPARE_PATH = path.join(root, 'docs', 'qa-mapping', 'evidence', 'mock-vs-java.json');
const MA_FIXTURE_PATH = path.join(root, 'fixtures', 'matriz', 'MA.json');

export const STATUS = {
  IMPLEMENTED: 'IMPLEMENTED',
  MOCKED_PASSED: 'MOCKED_PASSED',
  MOCKED_UNKNOWN: 'MOCKED_UNKNOWN',
  LIVE_PASSED: 'LIVE_PASSED',
  LIVE_PASSED_HISTORICAL: 'LIVE_PASSED_HISTORICAL',
  LIVE_PENDING: 'LIVE_PENDING',
  BLOCKED: 'BLOCKED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function specPath(uf) {
  return path.join(root, 'e2e', 'contratos', 'page02', `${uf.toLowerCase()}-estrutural.spec.ts`);
}

function liveByUf(catalog) {
  const map = {};
  for (const run of catalog.runs || []) {
    for (const uf of run.ufs || []) {
      const previous = map[uf];
      if (!previous || String(run.id) > String(previous.id)) {
        map[uf] = run;
      }
    }
  }
  return map;
}

function mockedFromResults(resultsPath) {
  if (!resultsPath || !fs.existsSync(resultsPath)) {
    return { available: false, passed: [], failed: [], skipped: [] };
  }
  const json = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const passed = new Set();
  const failed = new Set();
  const skipped = new Set();

  const visit = (suite, parentTitles = []) => {
    const titles = parentTitles.concat(suite.title || []).filter(Boolean);
    for (const spec of suite.specs || []) {
      const file = String(spec.file || spec.location?.file || '').replace(/\\/g, '/');
      if (!/contratos\/page02\//i.test(file)) continue;
      const ufs = extractUfsFromSpec({ ...spec, parentTitles: titles }).filter((uf) =>
        STRUCTURAL_UFS_IMPLEMENTED.includes(uf),
      );
      if (!ufs.length) continue;
      const test = (spec.tests || [])[0] || {};
      const status = test.status || (spec.ok ? 'expected' : 'unexpected');
      const resultStatus = Array.isArray(test.results) && test.results.length
        ? test.results[test.results.length - 1]?.status
        : undefined;
      for (const uf of ufs) {
        if (status === 'skipped' || resultStatus === 'skipped') skipped.add(uf);
        else if (status === 'unexpected' || spec.ok === false) failed.add(uf);
        else passed.add(uf);
      }
    }
    for (const child of suite.suites || []) visit(child, titles);
  };
  for (const suite of json.suites || []) visit(suite);
  return {
    available: true,
    passed: [...passed].sort(),
    failed: [...failed].sort(),
    skipped: [...skipped].sort(),
  };
}

export function buildUfQualityIndicators(options = {}) {
  const inventory = readJson(INVENTORY_PATH);
  const catalog = readJson(LIVE_RUNS_PATH);
  const matriz = fs.existsSync(MATRIZ_COMPARE_PATH) ? readJson(MATRIZ_COMPARE_PATH) : null;
  const liveMap = liveByUf(catalog);
  const mocked = mockedFromResults(options.e2eResultsPath || path.join(root, 'test-results', 'e2e-results.json'));
  const maFixtureExists = fs.existsSync(MA_FIXTURE_PATH);

  const ufs = {};
  for (const uf of STRUCTURAL_UFS_IMPLEMENTED) {
    const profile = inventory.ufs?.[uf];
    if (!profile) {
      throw new Error(`UF ${uf} está na allowlist estrutural sem perfil no inventário live.`);
    }
    const liveRun = liveMap[uf];
    const liveStatus = liveRun
      ? liveRun.coberturaDoCodigoAtual
        ? STATUS.LIVE_PASSED
        : STATUS.LIVE_PASSED_HISTORICAL
      : STATUS.LIVE_PENDING;
    let mockedStatus = STATUS.MOCKED_UNKNOWN;
    if (mocked.available) {
      if (mocked.failed.includes(uf)) mockedStatus = 'MOCKED_FAILED';
      else if (mocked.skipped.includes(uf)) mockedStatus = 'MOCKED_SKIPPED';
      else if (mocked.passed.includes(uf)) mockedStatus = STATUS.MOCKED_PASSED;
    }

    ufs[uf] = {
      uf,
      implementation: STATUS.IMPLEMENTED,
      specExists: fs.existsSync(specPath(uf)),
      formularioDisponivel: Boolean(profile.formularioDisponivel),
      fieldCount: profile.fieldCount,
      requiredVisualCount: profile.requiredVisualCount,
      terceiroGarantidor: Boolean(profile.terceiroGarantidor?.visivel),
      credor: Boolean(profile.credor),
      documentos: Boolean(profile.documentos),
      matrizJava: Boolean(profile.matrizJava),
      novoUsado: Boolean(profile.veiculo?.zeroKm),
      mockedStatus,
      liveStatus,
      liveRunId: liveRun?.id || null,
      liveRunUrl: liveRun?.url || null,
      liveSha: liveRun?.sha || null,
      liveCoversCurrentSha: Boolean(liveRun?.coberturaDoCodigoAtual),
      blockedReason: catalog.credentialStatus || null,
    };
  }

  const se = inventory.ufs?.SE;
  const seRow = {
    uf: 'SE',
    implementation: STATUS.NOT_APPLICABLE,
    specExists: fs.existsSync(specPath('SE')),
    formularioDisponivel: Boolean(se?.formularioDisponivel),
    fieldCount: se?.fieldCount ?? 0,
    requiredVisualCount: se?.requiredVisualCount ?? 0,
    terceiroGarantidor: Boolean(se?.terceiroGarantidor?.visivel),
    credor: Boolean(se?.credor),
    documentos: Boolean(se?.documentos),
    matrizJava: Boolean(se?.matrizJava),
    novoUsado: Boolean(se?.veiculo?.zeroKm),
    mockedStatus: 'MOCKED_SKIPPED',
    liveStatus: STATUS.NOT_APPLICABLE,
    liveRunId: null,
    liveRunUrl: null,
    liveSha: null,
    liveCoversCurrentSha: false,
    blockedReason: catalog.notApplicableReason || 'Formulário indisponível',
  };

  const implemented = STRUCTURAL_UFS_IMPLEMENTED;
  const liveHistorical = implemented.filter((uf) => ufs[uf].liveStatus === STATUS.LIVE_PASSED_HISTORICAL);
  const livePassedCurrent = implemented.filter((uf) => ufs[uf].liveStatus === STATUS.LIVE_PASSED);
  const livePending = implemented.filter((uf) => ufs[uf].liveStatus === STATUS.LIVE_PENDING);
  const mockedPassed = implemented.filter((uf) => ufs[uf].mockedStatus === STATUS.MOCKED_PASSED);

  return {
    geradoPor: 'scripts/uf-quality-indicators.mjs',
    headCatalogado: catalog.headNoMomentoDaAuditoria,
    liveOnCurrentSha: Boolean(catalog.liveOnCurrentSha),
    credentialStatus: catalog.credentialStatus,
    maFixtureExists,
    maJavaArtificial: maFixtureExists,
    matriz: matriz
      ? {
          overlap: matriz.overlap?.length ?? 0,
          mismatch_count: matriz.mismatch_count,
          missing_in_mock: matriz.missing_in_mock,
          extra_in_mock: matriz.extra_in_mock,
          pw_only: matriz.pw_only,
        }
      : null,
    mockedResultsAvailable: mocked.available,
    counts: {
      implemented: implemented.length,
      mockedPassed: mockedPassed.length,
      livePassedCurrent: livePassedCurrent.length,
      livePassedHistorical: liveHistorical.length,
      livePending: livePending.length,
      blockedNewLive: catalog.credentialStatus === 'BLOCKED_SECURITY_CREDENTIAL_ROTATION' ? implemented.length : 0,
      notApplicable: 1,
    },
    classification: {
      IMPLEMENTED: implemented,
      MOCKED_PASSED: mockedPassed,
      LIVE_PASSED: livePassedCurrent,
      LIVE_PASSED_HISTORICAL: liveHistorical,
      LIVE_PENDING: livePending,
      BLOCKED: catalog.credentialStatus === 'BLOCKED_SECURITY_CREDENTIAL_ROTATION' ? implemented : [],
      NOT_APPLICABLE: ['SE'],
    },
    ufs,
    se: seRow,
  };
}

function markdownTable(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `|${headers.map(() => '---').join('|')}|`;
  const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

export function renderUfQualityMarkdown(indicators) {
  const rows = [
    ...STRUCTURAL_UFS_IMPLEMENTED.map((uf) => {
      const item = indicators.ufs[uf];
      return [
        uf,
        item.implementation,
        item.mockedStatus,
        item.liveStatus,
        item.liveRunId || '—',
        item.liveCoversCurrentSha ? 'sim' : 'não',
        String(item.fieldCount),
        String(item.requiredVisualCount),
        item.terceiroGarantidor ? 'sim' : 'não',
        item.matrizJava ? 'sim' : 'não',
      ];
    }),
    [
      'SE',
      indicators.se.implementation,
      indicators.se.mockedStatus,
      indicators.se.liveStatus,
      '—',
      'não',
      String(indicators.se.fieldCount),
      String(indicators.se.requiredVisualCount),
      'não',
      indicators.se.matrizJava ? 'sim' : 'não',
    ],
  ];

  return [
    '### Indicadores PAGE-02',
    '',
    markdownTable(
      ['Métrica', 'Valor'],
      [
        ['UFs implementadas', String(indicators.counts.implemented)],
        ['Mocked aprovadas (execução local/CI disponível)', String(indicators.counts.mockedPassed)],
        ['Live no SHA atual', String(indicators.counts.livePassedCurrent)],
        ['Live histórico (SHA anterior)', String(indicators.counts.livePassedHistorical)],
        ['Live pendente', String(indicators.counts.livePending)],
        ['Não aplicável', String(indicators.counts.notApplicable)],
        ['Status de credencial', indicators.credentialStatus],
        ['Live no SHA atual?', indicators.liveOnCurrentSha ? 'sim' : 'não'],
        ['Fixture Java de MA', indicators.maFixtureExists ? 'presente (inválido)' : 'ausente (correto)'],
      ],
    ),
    '',
    '### Matriz por UF',
    '',
    markdownTable(
      [
        'UF',
        'Implementação',
        'Mocked',
        'Live',
        'Run',
        'Cobre SHA atual',
        'Campos',
        '*',
        'TG',
        'Java',
      ],
      rows,
    ),
    '',
    '_LIVE_PASSED_HISTORICAL não equivale a LIVE_PASSED do código atual. Novo live permanece bloqueado enquanto a rotação da senha Master não for comprovada._',
    '',
  ].join('\n');
}

const invoked = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invoked === path.resolve(fileURLToPath(import.meta.url))) {
  const indicators = buildUfQualityIndicators();
  fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'test-results', 'uf-quality-indicators.json'),
    `${JSON.stringify(indicators, null, 2)}\n`,
    'utf8',
  );
  console.log(
    `indicadores implemented=${indicators.counts.implemented} mocked=${indicators.counts.mockedPassed} liveHistorical=${indicators.counts.livePassedHistorical} pending=${indicators.counts.livePending.join?.() || indicators.counts.livePending}`,
  );
}
