# Auditoria de segurança live-readonly — Etapa 8

## Environment

- Nome: `live-readonly`
- Reviewer: `JCarvalhoQA` (aplicado na etapa 7)
- Branch policy: somente `main`
- Secrets: `PLAYWRIGHT_MASTER_USER`, `PLAYWRIGHT_MASTER_PASSWORD` (somente Environment)
- `can_admins_bypass`: true (único maintainer)
- Live em PR: recusado por `ci-select` e pelo `if` do job

## Credencial exposta

O artifact do run 42220549160 continha o valor do campo senha no `error-context.md`. O artifact foi **excluído**.

**Rotação da senha Master: não confirmada nesta etapa.** Novos disparos live na CI permanecem **bloqueados** até confirmação explícita.

## Controles nesta etapa

- Após o POST de login, `LoginPage.redactSensitiveFields()` limpa usuário/senha do DOM.
- Live: `video: off`, `trace: off` no `playwright.config` quando `PLAYWRIGHT_MODE=live-readonly`.
- Upload live: sem `trace.zip` / vídeo; `error-context` sanitizado; retenção 7 dias.
- `workers=1`, `fullyParallel=false`, `retries=0`.
- Concorrência live: **não** cancela run em andamento (`cancel-in-progress` falso só no dispatch live).
- persistGuard instalado no `beforeEach` live, antes da navegação autenticada.

## Limites do persistGuard (inalterados)

WebSocket, form nativo, outro BrowserContext, service workers (já bloqueados no config), GET com efeito colateral.
