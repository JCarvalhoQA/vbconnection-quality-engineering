# Auditoria de segurança — Etapa 10

Classificação da **rotação** da credencial Master: **`BLOCKED_SECURITY_CREDENTIAL_ROTATION`**

A classificação refere-se à prova de rotação, não ao resultado estrutural. O run live `42267723718` passou; isso **não** prova que a senha vazada foi invalidada.

## Secrets (última evidência de timestamp)

API GitHub, nomes e `updated_at` apenas — consultados na implementação do PR #8:

| Secret | updated_at |
|---|---|
| `PLAYWRIGHT_MASTER_USER` | 2026-11-05T18:14:38Z |
| `PLAYWRIGHT_MASTER_PASSWORD` | 2026-11-05T18:14:39Z |

Exposição histórica: artifact `42220549160` (2026-11-06). Os timestamps acima são **anteriores** ao leak. Sem evidência de atualização posterior, invalidação da senha antiga, nem confirmação humana de rotação.

Runs live posteriores (`42255471291`, `42267723718`) **não** substituem essa prova.

## Controles preservados

- `workers=1`, `fullyParallel=false`, `retries=0` em live
- Environment `live-readonly` restrito à `main` + aprovação humana
- Live skipped em Pull Requests (PR #8: Live readonly SKIPPED)
- Sem trace/vídeo live
- Sanitização de artifacts
- `persistGuard` antes da interação
- Secrets mascarados nos logs (`PLAYWRIGHT_MASTER_PASSWORD: ***`)

## Limites do persistGuard

WebSocket, submit nativo de form e outro `BrowserContext` continuam fora do abort de `/api/`.
