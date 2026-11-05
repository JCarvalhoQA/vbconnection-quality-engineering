# Melhorias do GitHub Actions (live-readonly)

Nenhuma mudança de YAML/job `if` foi feita: o skip em PR era o contrato.

## Correção operacional aplicada

| Item | Antes | Depois |
|---|---|---|
| Environment `live-readonly` | inexistente (404) | criado, sem reviewers |
| Secrets Master | nenhum no repo e nenhum no environment | `PLAYWRIGHT_MASTER_USER` e `PLAYWRIGHT_MASTER_PASSWORD` **somente** no environment |
| Disparo live | nunca executado nesta versão do workflow | `workflow_dispatch` run `42082614109` na feature branch |

Sem isso, o próximo `workflow_dispatch` live falharia em `ci-select.mjs` com “requires Master credentials”, o que **não** era a causa do skip original.

## Melhorias opcionais (não implementadas)

1. **Reviewers no Environment** — exigir aprovação humana antes do job live. Respeitar se for ligado; hoje o repositório pessoal não tinha Environment.
2. **Restringir o Environment a `main`** — `deployment_branch_policy`. O disparo desta auditoria usou a feature branch de propósito (sem `--force`, sem merge extra). Depois do PR de docs, pode-se limitar a `main`.
3. **Step `--list` no job live** — gravar a lista selecionada no log antes do run, falhando se o total for 0. Playwright 1.55 já falha com `Error: No tests found`; o `--list` deixaria o conjunto visível.
4. **Falhar se todos os testes forem skipped** — `test.skip(!LIVE)` pode ficar verde com 1 skipped caso a flag `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE` não seja setada. Hoje o workflow seta a flag; um assert no summary (`failed + passed > 0`) fecharia o buraco.
5. **`requireMasterCredentials` em CI** — hoje faz `test.skip` se o secret faltar no *teste*. O `ci-select` já falha o job antes. Trocar skip por throw só em `CI=true` evitaria falso verde se a ordem dos steps mudar.
6. **Não usar `--pass-with-no-tests`** — já não é usado. Manter assim.
7. **Artefato sempre no live** — `if-no-files-found: warn` já faz upload parcial. Ok.

## O que não fazer

- Não remover o `if` de `workflow_dispatch` para “passar” live em PR.
- Não colocar Master em secrets de repositório (vazariam para o job mocked / forks conforme configuração).
- Não executar `suite=regression` live neste piloto (Gates 0–3 + 19 UFs).
- Não tratar falha live como skip.
- Não merge automático na `main`.
