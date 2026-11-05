/**
 * E2-04 — Gera fixtures/matriz/{UF}.json a partir de docs/qa-mapping/evidence/matriz-form.json.
 * Determinístico: sem timestamp; campos e UFs ordenados; fonteHash do JSON-fonte.
 * CE/RO são gerados como dado (Java), mas não entram no tipo DetranUf da suíte.
 * SE não é gerado: sem coluna na matriz Java.
 */
import { createHash } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const sourcePath = join(repoRoot, 'docs', 'qa-mapping', 'evidence', 'matriz-form.json');
const outDir = join(repoRoot, 'fixtures', 'matriz');

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

const ID_HMG = {
  AC: 17,
  AP: 225,
  BA: 14,
  CE: 236,
  DF: 232,
  ES: 230,
  MG: 9,
  MS: 226,
  MT: 233,
  PB: 13,
  PE: 3,
  PR: 10,
  RJ: 16,
  RN: 228,
  RO: 234,
  RR: 11,
  RS: 231,
  SC: 4,
  SP: 1,
  TO: 122,
};

const SUITE_UFS = new Set([
  'AC',
  'AP',
  'BA',
  'DF',
  'ES',
  'MG',
  'MS',
  'MT',
  'PB',
  'PE',
  'PR',
  'RJ',
  'RN',
  'RR',
  'RS',
  'SC',
  'SP',
  'TO',
]);

const sourceText = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const fonteHash = createHash('sha256').update(sourceText, 'utf8').digest('hex').slice(0, 16);
const source = JSON.parse(sourceText);
mkdirSync(outDir, { recursive: true });

const ufs = [...source.ufs].sort();
const todas = {};

for (const uf of ufs) {
  const secoes = {};
  const campos = {};

  for (const [etapa, apiKey] of Object.entries(ETAPA_API)) {
    secoes[apiKey] = Boolean(source.secoes_por_uf[uf][etapa]);
    campos[apiKey] = {};
    const etapaCampos = source.etapas[etapa] || {};
    for (const field of Object.keys(etapaCampos).sort()) {
      const cell = etapaCampos[field][uf];
      if (!cell) {
        continue;
      }
      campos[apiKey][field] = [Boolean(cell.visivel), Boolean(cell.obrigatorio)];
    }
  }

  const fixture = {
    uf,
    origem: 'docs/qa-mapping/evidence/matriz-form.json',
    fonteJava: 'auto.core/src/main/java/serasa/core/formulario/matriz/MatrizDados*.java',
    fonteHash,
    idHmg: ID_HMG[uf] ?? null,
    naSuitePlaywright: SUITE_UFS.has(uf),
    secoes,
    campos,
  };

  todas[uf] = fixture;
  writeFileSync(join(outDir, `${uf}.json`), `${JSON.stringify(fixture, null, 2)}\n`, 'utf8');
}

writeFileSync(join(outDir, 'todas.json'), `${JSON.stringify(todas, null, 2)}\n`, 'utf8');

const readme = `# Fixtures de matriz por UF

Geradas por \`npm run matriz:generate\` a partir de \`docs/qa-mapping/evidence/matriz-form.json\`.

- \`[visivel, obrigatorio]\` espelha \`Boolean[]\` do Java.
- \`secoes\` espelha \`GET /api/form/detran/{id}\` (\`anyMatch\` campo visível).
- \`fonteHash\` é SHA-256 (16 hex) do JSON-fonte — o gerador é determinístico (sem timestamp).
- **SE** não possui arquivo: sem coluna na matriz Java (\`formularioIndisponivel\`).
- **CE** e **RO** têm arquivo (Java), mas \`naSuitePlaywright: false\` até evidência no destinos-combo.

Não afirmar paridade com a Nova UX real: estas fixtures são **CONFIRMADO_CODIGO**, usadas só no mock.
`;

writeFileSync(join(outDir, 'README.md'), readme, 'utf8');

process.stdout.write(
  `geradas ${Object.keys(todas).length} UFs em ${outDir} (suite=${[...SUITE_UFS].length} hash=${fonteHash})\n`,
);
