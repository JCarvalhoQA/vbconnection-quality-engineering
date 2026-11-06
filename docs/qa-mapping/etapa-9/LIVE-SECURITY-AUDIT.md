# Auditoria de segurança live-readonly — Etapa 9

Classificação: **`BLOCKED_SECURITY_CREDENTIAL_ROTATION`**

## Credencial Master

O artifact do run `42220549160` expôs valor de senha no `error-context`. O artifact foi excluído na etapa 7.

Evidência administrativa do secret no Environment `live-readonly` (API GitHub, **sem** imprimir valores):

| Secret | created_at | updated_at |
|---|---|---|
| `PLAYWRIGHT_MASTER_USER` | 2026-11-05T18:14:38Z | 2026-11-05T18:14:38Z |
| `PLAYWRIGHT_MASTER_PASSWORD` | 2026-11-05T18:14:39Z | 2026-11-05T18:14:39Z |

A senha no GitHub **não** foi atualizada depois da exposição. Não há evidência de que a senha antiga tenha sido invalidada na aplicação.

O run live `42245037609` (pós-merge do PR #6) usou esse mesmo secret. Isso **não** comprova rotação.

Novos disparos live a partir desta etapa permanecem bloqueados até confirmação explícita de rotação da senha **e** atualização do secret.

Não foi tentado login com a senha antiga.

## Environment

- Nome: `live-readonly`
- Reviewer obrigatório: `JCarvalhoQA`
- Branch policy: somente `main`
- `can_admins_bypass`: true (único maintainer)
- Secrets só no Environment; job live `if: workflow_dispatch && mode == live-readonly`
- PR: job live skipped; `ci-select` recusa live em `pull_request`

## Controles preservados

`workers=1`, `fullyParallel=false`, `retries=0`, persistGuard antes da sessão, redação de campos de login, live sem trace/vídeo, retenção de artifact live 7 dias, concorrência live enfileira.

## Limites do persistGuard (inalterados)

WebSocket, form nativo, outro BrowserContext, GET com efeito colateral.
