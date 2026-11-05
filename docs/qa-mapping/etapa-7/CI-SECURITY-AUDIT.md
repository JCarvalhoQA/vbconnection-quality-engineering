# Auditoria de segurança — Environment `live-readonly`

**Data:** 2026-11-05  
**Repositório:** [JCarvalhoQA/vbconnection-quality-engineering](https://github.com/JCarvalhoQA/vbconnection-quality-engineering)

## Estado atual (metadados)

| Item | Valor |
|---|---|
| Environment | existe (`live-readonly`) |
| Secrets (nomes) | `PLAYWRIGHT_MASTER_USER`, `PLAYWRIGHT_MASTER_PASSWORD` |
| Secrets de repositório | nenhum |
| Protection rules | **nenhuma** |
| Deployment branch policy | **null** (qualquer branch do repo) |
| Required reviewers | **não** |
| Wait timer | 0 |
| `can_admins_bypass` | true |
| Branch protection `main` | **não configurada** (HTTP 404) |
| Workflow `permissions` | `contents: read` |
| Job live `if` | `workflow_dispatch && inputs.mode == 'live-readonly'` |
| Job mocked | sem environment, sem Master |

PRs **não** recebem os secrets Master. `ci-select.mjs` recusa live em `pull_request`. Em CI, ausência de Master **falha** o job (não skip).

## Isolamento

- Credenciais só no Environment.
- Logs mascaram `PLAYWRIGHT_MASTER_*` como `***`.
- Relatórios sanitizam Bearer, password, e-mail.
- `persistGuard` live aborta mutações `/api/` (exceto auth).

## Limitações do plano GitHub

Ambiente pessoal. Branch protection e required reviewers de Environment dependem do plano e de permissão admin. Esta auditoria **não** tentou contornar ausência de feature.

## Configuração pretendida (não aplicada)

Antes de ligar reviewers ou restringir branches, é necessária aprovação explícita.

Proposta:

1. **Required reviewers** no Environment `live-readonly` — o dono do repositório (ou um segundo maintainer). O job live espera aprovação **antes** de injetar secrets.
2. **Deployment branch policy** customizada: somente `main` (após merge revisado). Disparos na feature branch deixam de usar o Environment.
3. Manter `can_admins_bypass` até haver segundo reviewer, senão o dono bloqueia a si mesmo.
4. **Não** colocar Master em secrets de repositório.
5. **Não** aprovação automática.

Efeito colateral de (2): o disparo live da Etapa 6 na feature branch deixaria de funcionar até o merge. Por isso a restrição só deve ir depois do acordo.

Esta etapa **não** alterou o Environment. Live na CI **não** foi redisparada.
