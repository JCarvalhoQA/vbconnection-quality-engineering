# Auditoria de segurança — Environment `live-readonly`

**Data:** 2026-11-05  
**Repositório:** [JCarvalhoQA/vbconnection-quality-engineering](https://github.com/JCarvalhoQA/vbconnection-quality-engineering)

## Estado atual (metadados)

| Item | Valor |
|---|---|
| Environment | existe (`live-readonly`) |
| Secrets (nomes) | `PLAYWRIGHT_MASTER_USER`, `PLAYWRIGHT_MASTER_PASSWORD` |
| Secrets de repositório | nenhum |
| Protection rules | **required_reviewers** + **branch_policy** |
| Deployment branch policy | customizada: somente `main` |
| Required reviewers | `JCarvalhoQA` (`prevent_self_review: false`) |
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

## Proteções aplicadas (após aprovação explícita)

Aprovação: restringir à `main` e exigir reviewer antes dos secrets.

1. **Required reviewers** no Environment `live-readonly` — reviewer `JCarvalhoQA`. O job live espera aprovação **antes** de injetar secrets.
2. **Deployment branch policy** customizada: somente `main`. Disparos em feature branch **não** recebem o Environment.
3. `can_admins_bypass` permanece **true** até haver segundo reviewer, para o dono não bloquear a si mesmo.
4. `prevent_self_review` permanece **false** — repositório pessoal com um único maintainer.
5. Master **não** está em secrets de repositório.
6. **Não** há aprovação automática.

Efeito colateral de (2): o disparo live da Etapa 6 na feature branch deixa de usar o Environment. Live na CI só após merge em `main` **e** aprovação do reviewer.

## Limitações restantes

- Repositório pessoal: o reviewer é o próprio dono. Não há separação de função até existir um segundo maintainer.
- `can_admins_bypass: true` permite que um admin ignore a espera de reviewer.
- Branch protection da `main` (PR obrigatório, status checks) **não** está disponível ou não foi configurada neste plano — HTTP 404. Não foi contornada.
- Live **não** foi redisparada nesta etapa: o critério exige revisão do PR **e** as proteções já confirmadas. As proteções estão ativas; o disparo continua pendente da revisão do PR #4 e do merge em `main`.
