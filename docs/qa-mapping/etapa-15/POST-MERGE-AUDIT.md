# Auditoria pós-merge — Etapa 15

**SHA da `main` auditado:** `d4c4aa6a289822607baf5975060f0e52af170620`  
**Data:** 2026-11-09.

## Integração

| Item | Evidência |
|---|---|
| [PR #14](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/pull/14) | MERGED em 2026-11-09T14:14:34Z |
| Merge commit | `d4c4aa6` |
| [CI #42630718790](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42630718790) | success (`pull_request`, SHA `6afb49e`) |
| Job live no PR | SKIPPED (contrato preservado) |
| Working tree local após FF | limpo antes desta ramificação de encerramento |

## Comandos reproduzidos nesta auditoria

| Comando | Resultado |
|---|---|
| `npm ci` | 8 pacotes, 0 vulnerabilidades |
| `npm run typecheck` | aprovado |
| `npm run test:unit` | **91 passed** |
| `npm run matriz:compare` | overlap=20 mismatch=0 missing=0 extra=0 |
| `npm run quality:gates` | Gates 1–6 PASS |
| `npm run test:mutation` | incluído nos unitários: 420 / 0 / 42 / score 1.00 |
| Regressão mocked | **100 passed / 3 skipped / 0 failed / 0 flaky** |

Skips: 2× SE registro + 1× `test.fixme` de recuperação de senha.

## Runs após o relatório da Etapa 15

Nenhum `workflow_dispatch` live-readonly novo. Últimos live continuam [42267723718](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718) e [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173).

## Workflow

`.github/workflows/playwright-tests.yml` na `main` contém Quality Gates, indicadores no artifact e restrição live → `refs/heads/main` + Environment `live-readonly`.
