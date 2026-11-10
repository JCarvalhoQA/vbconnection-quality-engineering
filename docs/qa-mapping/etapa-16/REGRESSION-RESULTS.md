# Regressão — Etapa 16

Ambiente: `vbconnection-newfront`, `--grep-invert @live-readonly`. Sem live.

| Comando | Resultado |
|---|---|
| `npm ci` | ok |
| `npm run typecheck` | aprovado |
| `npm run test:unit` | **93 passed** (inclui 2 testes de `corpoMockRegistrar`) |
| `npm run matriz:compare` | overlap=20 mismatch=0 missing=0 extra=0 |
| `npm run quality:gates` (com `QUALITY_GATES_REQUIRE_E2E=1`) | Gates 1–6 PASS |
| `npm run test:mutation` | 5 passed; score **1.00** (420 / 0 / 42) |
| `npm run validate:pipeline` | canários aprovados |
| PAGE-02 estrutural 21 UFs `@mocked` | 21 passed / 0 failed / 0 skipped (~1,1 min) |
| Negativos novos | 2 passed (CT-052, CT-053) |
| Regressão mocked completa | **102 passed / 3 skipped / 0 failed / 0 flaky** (~4,1 min) |

Skips conhecidos: 2× SE registro + 1 `test.fixme` CT-016. Antes da etapa: 100 passed / 3 skipped. Delta = +2 testes.

Flaky: 0.

Live: **não disparado**.
