# Avaliação de segurança — Etapa 11

## Rotação da credencial Master

Classificação: **`BLOCKED_SECURITY_CREDENTIAL_ROTATION`**

Últimos timestamps conhecidos (API GitHub, nomes apenas; Etapa 10):

| Secret | updated_at |
|---|---|
| `PLAYWRIGHT_MASTER_USER` | 2026-11-05T18:14:38Z |
| `PLAYWRIGHT_MASTER_PASSWORD` | 2026-11-05T18:14:39Z |

Exposição histórica: artifact `42220549160` (2026-11-06). Timestamps **anteriores** ao leak. Sem evidência de rotação, invalidação da senha antiga nem aceite formal de risco pelo responsável autorizado.

O sucesso live `42267723718` **não** comprova rotação. Live do lote 4 **não** será disparado neste PR.

## Política de expiração periódica

A API devolve `passwordExpirado: true` e a SPA abre **Alterar senha**. Diagnóstico implementado em `diagnoseLiveAuth` / `assertLiveAuthUsable`:

- Código `AUTH_PASSWORD_EXPIRED`.
- Interrompe a sessão live (`LiveAuthBlockedError`).
- Não tenta alterar a senha.
- Não imprime token, usuário ou senha.
- Orienta atualizar `PLAYWRIGHT_MASTER_PASSWORD` no Environment `live-readonly` após troca autorizada.

Também detecta heading `Alterar senha` e URL `/alterar|senha|expirad/`. 2FA usa código `AUTH_TWO_FACTOR`.

Evidência mocked: `tests/liveInspect.test.ts` + `e2e/login/login-fluxos.spec.ts` (Alterar senha).

## Controles preservados

- `workers=1`, `fullyParallel=false`, `retries=0` em live
- Environment `live-readonly` restrito à `main` + aprovação humana
- Live skipped em Pull Requests
- Sem trace/vídeo live
- `persistGuard` antes da interação
- Secrets mascarados nos logs

## Limites do persistGuard

WebSocket, submit nativo de form e outro `BrowserContext` continuam fora do abort de `/api/`.
