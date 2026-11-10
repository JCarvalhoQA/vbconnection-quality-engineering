# Resultados de regressão — Etapa 18

Live-readonly **não** executado.

| Comando | Resultado |
|---|---|
| `npm run typecheck` | ok |
| `npm run test:unit` | **101 passed** (93 base + 8 novos) |
| `npm run matriz:compare` | overlap=20 mismatch=0 missing=0 extra=0 |
| `npm run quality:gates` | gates 1–3 e 5–6 PASS; gate-4 SKIPPED local sem `QUALITY_GATES_REQUIRE_E2E=1` |
| `npm run test:mutation` | 5 passed · score **1.00** (420 / 0 / 42) |
| mocked `--grep-invert @live-readonly` | **111 passed, 3 skipped** |

Skips conhecidos: SE (2) + recuperação 500 (1). Nenhum skip novo.

Flake: RO estrutural falhou uma vez (heading PAGE-02) e passou no retry isolado e na regressão seguinte. Sem alteração do spec RO.

Specs novas na regressão: +1 positivo, +3 negativos, +2 HTTP, +3 imagem navegação = +9 e2e (102→111).
