# Auditoria CI/CD — Etapa 13

**Evidência:** `.github/workflows/playwright-tests.yml`, `scripts/ci-select.mjs`, `playwright.config.ts`.

## Plataforma

| Item | Valor |
|---|---|
| Runner | `ubuntu-24.04` |
| Node | 24 (`actions/setup-node@v5`, cache npm) |
| Actions | checkout@v5, upload-artifact@v6 |
| Permissões | `contents: read` |
| Concurrency | por ref + mode; live não cancela |
| Mocked retries | 1 no CI (config) |
| Live | `workers=1`, `fullyParallel=false` (`PLAYWRIGHT_MODE`), CLI `--workers=1 --retries=0` |
| Artifacts mocked | 14 dias; live 7 dias, sem trace/vídeo |
| Environment | `live-readonly` + aprovação humana |

## Gates validados

| Regra | Evidência |
|---|---|
| PR só mocked | job mocked `if` PR; live skipped no PR #11 |
| Live só dispatch | `workflow_dispatch && mode == live-readonly` |
| Live só `main` | **YAML `github.ref == refs/heads/main`** + ci-select recusa outro `GITHUB_REF` |
| Seleção vazia/inválida falha | `validate-pipeline-local.mjs` |
| Registro persistente fora do live structural | `PLAYWRIGHT_UFS` só specs `*-estrutural.spec.ts` |

## Esta etapa

Canário novo: `GITHUB_REF=refs/heads/feat/...` + live-readonly → exit 2.

## Status / limitação

Status: restrição à `main` agora está no YAML, não só na documentação do Environment.  
Limitação: Environment GitHub (reviewers) não é auditável só pelo YAML; permanece dependência administrativa.
