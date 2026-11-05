/**
 * Recalcula divergências mock (fixtures/matriz) × Java (matriz-form.json).
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const sourcePath = join(repoRoot, 'docs', 'qa-mapping', 'evidence', 'matriz-form.json');
const fixturesPath = join(repoRoot, 'fixtures', 'matriz', 'todas.json');
const outPath = join(repoRoot, 'docs', 'qa-mapping', 'evidence', 'mock-vs-java.json');

const ETAPA_API = {
  agente: 'DADOS_AGENTE_FINANCEIRO',
  veiculo: 'DADOS_VEICULO',
  contrato: 'DADOS_CONTRATO',
  devedor: 'DADOS_DEVEDOR',
  credor: 'DADOS_CREDOR',
  complementares: 'DADOS_COMPLEMENTARES',
  terceiro_garantidor: 'DADOS_TERCEIRO_GARANTIDOR',
  aditivo: 'DADOS_ADITIVO',
};

function statusOf(visivel, obrigatorio) {
  if (!visivel) return 'oculto';
  return obrigatorio ? 'obrigatorio' : 'opcional';
}

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const fixtures = JSON.parse(readFileSync(fixturesPath, 'utf8'));

const javaUfs = source.ufs;
const fixtureUfs = Object.keys(fixtures).sort();
const suiteUfs = fixtureUfs.filter((uf) => fixtures[uf].naSuitePlaywright);
const overlap = javaUfs.filter((uf) => fixtureUfs.includes(uf));
const javaOnly = javaUfs.filter((uf) => !fixtureUfs.includes(uf));
const pwOnly = ['SE'];

const mismatches = [];
const missingInMock = [];
const extraInMock = [];

for (const uf of overlap) {
  const fixture = fixtures[uf];
  for (const [etapa, apiKey] of Object.entries(ETAPA_API)) {
    const javaSecao = Boolean(source.secoes_por_uf[uf][etapa]);
    const mockSecao = Boolean(fixture.secoes[apiKey]);
    if (javaSecao !== mockSecao) {
      mismatches.push({ uf, etapa, campo: '__SECAO__', mock: mockSecao, java: javaSecao });
    }

    const javaCampos = source.etapas[etapa] || {};
    const mockCampos = fixture.campos[apiKey] || {};

    for (const [campo, byUf] of Object.entries(javaCampos)) {
      const cell = byUf[uf];
      if (!cell) continue;
      const mock = mockCampos[campo];
      if (!mock) {
        missingInMock.push({ uf, etapa, campo, java: cell.status });
        continue;
      }
      const mockStatus = statusOf(mock[0], mock[1]);
      if (mockStatus !== cell.status) {
        mismatches.push({ uf, etapa, campo, mock: mockStatus, java: cell.status });
      }
    }

    for (const campo of Object.keys(mockCampos)) {
      if (!javaCampos[campo] || !javaCampos[campo][uf]) {
        extraInMock.push({ uf, etapa, campo });
      }
    }
  }
}

const signatures = {};
for (const item of mismatches) {
  const key = `${item.etapa}|${item.campo}|${item.mock}|${item.java}`;
  signatures[key] = signatures[key] || {
    n: 0,
    etapa: item.etapa,
    campo: item.campo,
    mock: item.mock,
    java: item.java,
    ufs: [],
  };
  signatures[key].n += 1;
  signatures[key].ufs.push(item.uf);
}

const result = {
  geradoEm: new Date().toISOString(),
  fonteMock: 'auto.ui/playwright/fixtures/matriz/{UF}.json',
  fonteJava: 'docs/qa-mapping/evidence/matriz-form.json',
  overlap,
  suiteUfs,
  pw_only: pwOnly,
  java_only: javaOnly,
  ceRoGeradosForaDaSuite: fixtureUfs.filter((uf) => !fixtures[uf].naSuitePlaywright),
  mismatch_count: mismatches.length,
  missing_in_mock: missingInMock.length,
  extra_in_mock: extraInMock.length,
  signatures: Object.values(signatures).sort((a, b) => b.n - a.n),
  remaining_pom_gaps: [
    'POM não preenche credor.END_* nem TEL_* do devedor (E2-20).',
    'POM não preenche INDICE_SIGLA / valor / parcelas se a Nova UX exigir — fills defensivos ifVisible.',
    'SE continua test.skip (formularioIndisponivel).',
    'CE/RO fora da suíte até destinos-combo live.',
    'Não há evidência de que a Nova UX consuma GET /api/form da mesma forma que o v2.',
  ],
};

writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
process.stdout.write(
  `overlap=${overlap.length} mismatch=${mismatches.length} missing=${missingInMock.length} extra=${extraInMock.length}\n`,
);
