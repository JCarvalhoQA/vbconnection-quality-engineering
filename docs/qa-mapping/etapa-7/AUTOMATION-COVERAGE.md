# Cobertura de automação após Etapa 7

## Estrutural PAGE-02

| UF | Mocked | Live-readonly | Registro persistente |
|---|---|---|---|
| BA | sim | sim (gated) | suíte existente (mocked POST) |
| CE | sim | sim (gated) | **não** — fora de `DetranUf` |
| RO | sim | sim (gated) | **não** — fora de `DetranUf` |

Total estrutural disponível: **6 testes** (3 mocked + 3 live). Live só com `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1` + Master + persistGuard.

A suíte `structural` live (`ci-select`) seleciona os três arquivos em `e2e/contratos/page02` com `@live-readonly`.

## Regressão mockada

85 testes contabilizados localmente (82 passed + 3 skipped). Gates 0–3 live continuam gated e invertidos na regressão.

## Relatórios CI

O summary agora traz modo, ambiente, branch, commit, suíte, UF, totais, flaky com 1ª falha, classificação de sintoma e nome do artifact. Não rotula automaticamente “defeito de produto”.
