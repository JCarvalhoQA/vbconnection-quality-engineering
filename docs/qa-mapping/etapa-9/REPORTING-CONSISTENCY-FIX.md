# Correção da consistência do relatório de UFs

## Evidência do defeito

Artifact `playwright-42245037609-live-readonly-smoke` / `test-results/e2e-summary.md`:

```text
Suíte: smoke
Lote: smoke
UFs selecionadas: todas as estruturais implementadas
UFs executadas: AC, AP, CE, DF, ES, RO
Total: 7
Aprovados: 7
```

O JSON da mesma run contém `ba-estrutural.spec.ts` com status passed.

## Correção

- Percorrer títulos dos `describe` pais.
- Extrair UF do arquivo `xx-estrutural.spec.ts` (case-insensitive).
- Preferir annotation `type=uf`.
- Distinguir solicitadas / selecionadas / executadas / aprovadas / reprovadas / ignoradas / não executadas a partir dos specs.
- Lote derivado dos conjuntos baseline / batch-01 / batch-02 — **nunca** da suíte.
- `ci-select` exporta `ufs` e `lote`; o workflow passa `PLAYWRIGHT_SELECTED_UFS` e `PLAYWRIGHT_LOTE`.
- Títulos e annotation `uf` em BA alinhados às demais specs.

## Testes

`scripts/testdata/structural-live-seven.json` reproduz o caso BA sem a sigla no título do teste.  
`structural-partial.json` cobre passed / failed / skipped / flaky.  
Canários em `validate-pipeline-local.mjs` (executados também por `tests/validatePipeline.test.ts`).
