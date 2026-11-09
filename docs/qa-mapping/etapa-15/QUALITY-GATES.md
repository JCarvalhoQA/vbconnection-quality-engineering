# Quality Gates — Etapa 15

Comando: `npm run quality:gates` (`scripts/quality-gates.mjs`).  
Não exige credencial Master. Não é required check de deploy do produto VBConnection.

## Resultado local (2026-11-09, após regressão mocked)

| Gate | Título | Status |
|---|---|---|
| 1 | Integridade do projeto | PASS |
| 2 | Unitários (contrato) | PASS |
| 3 | Matriz UI/Java | PASS |
| 4 | Regressão mocked | PASS (`QUALITY_GATES_REQUIRE_E2E=1`) |
| 5 | Mutation testing | PASS |
| 6 | Live-readonly | PASS (controles estáticos) |

## O que cada gate verifica

### Gate 1 — Integridade

TypeScript no workflow; script checa Playwright live (`workers=1`, `retries=0`, `fullyParallel` off, trace off), `persistGuard`, `AUTH_PASSWORD_EXPIRED`, 21 specs, ausência de `fixtures/matriz/MA.json`, nenhum `.env` versionado.

### Gate 2 — Unitários

Contrato dos testes: mutation 420/0/42, `persistGuard`, canário de pipeline. A execução em si é `npm run test:unit` (90 passed nesta etapa).

### Gate 3 — Matriz

`mock-vs-java.json`: mismatch=0, missing=0, SE em `pw_only`, MA fora do overlap. Sem matriz Java artificial de MA.

### Gate 4 — Mocked

No job mocked, após o e2e, `QUALITY_GATES_REQUIRE_E2E=1` exige `e2e-results.json` sem falhas definitivas. Antes do e2e o gate fica SKIPPED para não duplicar falha e não depender de leftover local. Job live **não** avalia este gate.

### Gate 5 — Mutation

Oráculos live/mocked presentes; teste exige score 1.00 do catálogo atual. Números reais: `npm run test:mutation` (incluído em `test:unit`).

### Gate 6 — Live-readonly

YAML: só `workflow_dispatch` na `main`, Environment `live-readonly`, CLI `--workers=1 --retries=0`, sanitização, sem upload de trace/vídeo. `ci-select.mjs` recusa live fora de `refs/heads/main`. PR continua só mocked.

## CI

Job mocked: typecheck → matriz → unit → quality:gates → e2e → summarize → quality:gates (Gate 4) → upload.  
Job live: typecheck → quality:gates (sem Master) → e2e serializado.

Artefatos: `test-results/quality-gates.json`, `quality-gates.md`, `uf-quality-indicators.json`.
