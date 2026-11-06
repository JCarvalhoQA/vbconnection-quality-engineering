# Avaliação de segurança — Etapa 12

## Rotação da credencial Master

Classificação: **`BLOCKED_SECURITY_CREDENTIAL_ROTATION`**

Últimos timestamps conhecidos (Etapa 10/11): `PLAYWRIGHT_MASTER_PASSWORD` em 2026-11-05T18:14:39Z — **antes** do leak `42220549160`.

Sucesso live `42281730173` (lote 4, 4/4) **não** comprova rotação. Expiração periódica **não** é prova de rotação antecipada.

Live de MA/TO **não** dispara neste PR.

## AUTH_PASSWORD_EXPIRED

Preservado em `diagnoseLiveAuth` / `assertLiveAuthUsable`. Interrompe, não altera senha, não registra credencial, orienta atualizar o secret após troca autorizada.

## Controles preservados

`workers=1`, `retries=0`, Environment `live-readonly` só na `main`, live skipped em PR, persistGuard, sem trace/vídeo live.
