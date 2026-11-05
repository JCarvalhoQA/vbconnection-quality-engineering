# Diagnóstico do workflow Playwright (live-readonly)

**Repositório:** [JCarvalhoQA/vbconnection-quality-engineering](https://github.com/JCarvalhoQA/vbconnection-quality-engineering)  
**Workflow:** `.github/workflows/playwright-tests.yml` (`Playwright tests`, id `405996085`)  
**Ambiente alvo:** `https://newfront.vbconnection.info/`  
**Data:** 2026-11-05

## Conclusão

O job `Live readonly` ignorado nas execuções de Pull Request **não é defeito**. A condição do YAML exige `workflow_dispatch` **e** `inputs.mode == 'live-readonly'`. Eventos `pull_request` avaliam essa condição como falsa e o GitHub marca o job como `skipped` com 0 steps.

A regressão mockada dessas execuções rodou com o modo padrão `mocked` / suíte `regression`, como desenhado.

## Eventos e jobs

| Evento | `PLAYWRIGHT_MODE` efetivo | Job Mocked | Job Live readonly |
|---|---|---|---|
| `pull_request` | `mocked` (fallback do `env`) | `if` verdadeiro → executa | `if` falso → skipped |
| `workflow_dispatch` + `mode=mocked` | `mocked` | executa | skipped |
| `workflow_dispatch` + `mode=live-readonly` | `live-readonly` | skipped | executa (`environment: live-readonly`) |

Condições no YAML (sem alteração nesta auditoria):

```yaml
mocked:
  if: github.event_name == 'pull_request' || (github.event_name == 'workflow_dispatch' && inputs.mode != 'live-readonly')

live-readonly:
  if: github.event_name == 'workflow_dispatch' && inputs.mode == 'live-readonly'
  environment: live-readonly
```

`inputs.*` só existem em `workflow_dispatch`. Em PR o workflow define:

- `PLAYWRIGHT_MODE: mocked`
- `SUITE: regression`
- `PLAYWRIGHT_TARGET: newfront`

## Inputs

`workflow_dispatch` declara `mode` (`mocked` \| `live-readonly`, default `mocked`), `suite` (`smoke` \| `regression` \| `structural`, default `smoke`) e `target` (`newfront` \| `hmg`, default `newfront`). `ci-select.mjs` rejeita `target=hmg` (site institucional, não a Nova UX).

## Branch e versão publicada

| Ref | SHA do commit | SHA do blob `playwright-tests.yml` | Observação |
|---|---|---|---|
| `feat/playwright-uf-mapping-ci-improvements` | `3a1c619` | `435b9c1c70412c50385817f34c58c1e1f31a27e5` | branch de trabalho |
| `main` | `9c849d3` (merge do PR #2 em 2026-11-05T17:26:14Z) | mesmo blob | workflow com jobs separados já está na default |

O disparo manual usa a versão do workflow **do ref escolhido**. Com o PR #2 já mesclado, `main` e a feature branch carregam o mesmo YAML de live-readonly. O botão *Run workflow* na UI passa a exibir `mode` / `suite` / `target`.

Esta auditoria **não fez merge**. O PR #2 já estava `MERGED` quando o diagnóstico começou.

## Permissões

- Workflow: `permissions.contents: read`
- Actions do repositório: habilitado, `allowed_actions=all`
- Job live usa Environment GitHub `live-readonly` (segredos Master só nesse environment)
- Job mocked **não** declara environment e **não** injeta `PLAYWRIGHT_MASTER_*`

## Environment e secrets (metadados)

Antes desta auditoria:

- `GET /environments` → `total_count: 0`
- `GET /environments/live-readonly/secrets` → 404
- `gh secret list` (repo) → vazio

Isso **não** explica o skip do PR (o job nem chega a avaliar secrets). Explicaria falha **depois** de um `workflow_dispatch` live, em `ci-select.mjs` (`live-readonly requires Master credentials`).

Ação operacional (sem mudar o YAML):

1. Environment `live-readonly` criado (`id` 26395630297), sem protection rules.
2. Secrets de environment (somente nomes confirmados): `PLAYWRIGHT_MASTER_USER`, `PLAYWRIGHT_MASTER_PASSWORD`.
3. Secrets de repositório continuam vazios (PRs não recebem Master).
4. Perfil local de referência: `PLAYWRIGHT_MASTER_PERFIL=MASTER`. O job live define `PLAYWRIGHT_MASTER_PERFIL: MASTER`.

Valores de secret **não** foram lidos, impressos nem commitados.

## Autenticação Master e persistGuard

O spec `e2e/contratos/page02/ba-estrutural.spec.ts` no describe `@live-readonly`:

1. `installPersistGuard(page, { mode: 'live-readonly' })` no `beforeEach`, antes de `login.goto()`.
2. Login real via `LoginPage` + `requireMasterCredentials()`.
3. `assertMasterProfile` exige `perfil === 'MASTER'`.
4. Sem `mockLoginApis` / `seedAuthenticatedSession` nesse describe.
5. `assertSemPersistenciaDefinitiva` + descarte da linha de veículo sem Registrar.

`persistGuard` em live aborta POST/PUT/PATCH/DELETE em `/api/` e URLs de persistência, e libera `/auth/`. Unitário: `tests/persistGuard.test.ts` (57 unitários no total, incluindo este caso).

## Seleção Playwright

`scripts/ci-select.mjs` para `mode=live-readonly` + `suite=structural` + `target=newfront`:

```text
--project=vbconnection-newfront e2e/contratos/page02 --grep @live-readonly
```

Projeto `vbconnection-newfront` → `https://newfront.vbconnection.info`. Ver `CI-SELECT-VALIDATION.md`.

O job live liga `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1` **depois** do `ci-select` e **antes** do `playwright test`. Gates 0–3 só ligam se `SUITE=regression`.

## Execuções inspecionadas

| Run | Evento | Branch / SHA | Mocked | Live readonly |
|---|---|---|---|---|
| [42073794477](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42073794477) | `pull_request` | `feat/...` `64e9802` | failure (fonteHash) | skipped 0s |
| [42074098852](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42074098852) attempt 1 | `pull_request` | `3a1c619` | success | skipped 0s |
| [42074098852](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42074098852) attempt 2 | `pull_request` | `3a1c619` | success (80 passed, 3 skipped) | skipped 0s |
| [42082614109](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42082614109) | `workflow_dispatch` | `feat/...` `3a1c619` | skipped | executado |

Detalhe do skip: `SKIPPED-JOB-ROOT-CAUSE.md`. Resultado live: `LIVE-EXECUTION-RESULT.md`.
