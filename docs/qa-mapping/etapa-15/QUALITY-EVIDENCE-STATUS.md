# Estado das evidências de qualidade — pós-merge Etapa 15

SHA da `main`: `d4c4aa6a289822607baf5975060f0e52af170620`.

| Indicador | Valor | Fonte |
|---|---|---|
| Run ID mocked PR #14 | 42630718790 | GitHub Actions |
| SHA mocked CI | `6afb49e` | PR head (ancestral do merge) |
| Branch | `main` após merge | git |
| Environment live | `live-readonly` | YAML + API |
| Data desta auditoria | 2026-11-09 | local + `gh` |
| UFs implementadas | 21 | allowlist |
| UFs mocked (local) | 21 MOCKED_PASSED | `e2e-results.json` PAGE-02 |
| Live SHA atual | **0** | catálogo |
| Live histórico | 19 | runs 42267723718, 42281730173 |
| Live pendente | MA, TO | catálogo |
| Bloqueio | `BLOCKED_SECURITY_CREDENTIAL_ROTATION` | secret `updated_at` |
| Não aplicável | SE | inventário |
| Passed mocked regressão | 100 | local 2026-11-09 |
| Failed | 0 | local |
| Skipped | 3 (classificados) | SE + fixme login |
| Flaky | 0 | local |
| Retries extras | 0 no live (retries=0); mocked CI pode retry 1 | config |
| Mutation score | 1.00 (420/0/42) | `test:mutation` |
| Quality Gates | 1–6 PASS | `npm run quality:gates` |
| Segurança | bloqueio live | checklist |

Diagnóstico SHA: live histórico cobre `83bcb5ed` e `a65997cc`, **não** o HEAD `d4c4aa6`. Ausência de evidência ≠ sucesso.
