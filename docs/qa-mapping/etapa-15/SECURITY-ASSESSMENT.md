# Avaliação de segurança — Etapa 15

## Incidente de credencial Master

Há histórico de exposição da senha Master em artifact (run [42220549160](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42220549160), 2026-11-06).

Checagem GitHub API do Environment `live-readonly` em 2026-11-09:

| Secret | `updated_at` |
|---|---|
| `PLAYWRIGHT_MASTER_PASSWORD` | 2026-11-05T18:14:39Z |
| `PLAYWRIGHT_MASTER_USER` | 2026-11-05T18:14:38Z |

A atualização do secret é **anterior** ao vazamento. Não há evidência de rotação posterior. A política de expiração periódica **não** prova que a senha antiga foi invalidada. A aprovação humana do Environment **não** encerra o incidente.

Não há aceite formal de risco versionado neste repositório.

**Decisão desta etapa:** não disparar live. Status `BLOCKED_SECURITY_CREDENTIAL_ROTATION`. Senha não impressa, não solicitada, não alterada automaticamente.

## Proteções preservadas

- Live só na `main` + `workflow_dispatch` + Environment `live-readonly`
- Secrets exclusivos do Environment
- `workers=1`, `fullyParallel=false`, `retries=0`
- `persistGuard` aborta mutações `/api/` no live (registrar incluído)
- Trace/vídeo off no live; sanitize de artifacts; upload sem `trace.zip`
- `AUTH_PASSWORD_EXPIRED`: interrompe, não troca senha, não loga credencial
- Nenhum registro real, nenhum upload de contrato

## Limite conhecido

GET em URL de persistência não é abortado (efeito colateral de consulta). WS / form nativo / outro context permanecem fora do interceptor HTTP.

## Recomendação

Responsável autorizado: rotacionar a senha Master, atualizar o secret **depois** da rotação, registrar a data, só então aprovar o Environment e disparar MA/TO.
