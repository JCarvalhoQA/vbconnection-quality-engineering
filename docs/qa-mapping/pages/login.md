# PAGE-01 — Página inicial e autenticação

URL: `https://newfront.vbconnection.info/`  
Status live: **CONFIRMADO_DOM** (login) + **CONFIRMADO_UI** (senha expirada). Home Master: **BLOQUEADO**.

## Fluxo

1. GET `/` entrega o shell Angular (não há `/login` estável no newfront).
2. Campos `formcontrolname=username|password`, IDs `#login-username` e `#login-password`.
3. POST `/auth/tokens`. Sucesso segue para home `/vbconnection/home` (**CONFIRMADO_TESTE** com mock).
4. 401 → "Usuário ou senha inválidos"; 5ª falha → "Usuário bloqueado" (**CONFIRMADO_TESTE** mock).
5. 2FA → heading "Verificação em duas etapas", `#codigo-segunda-etapa`, `data-testid=email-destino`.
6. `passwordExpirado` → heading "Alterar senha", IDs `#expirada-password`, `#expirada-new-password`, `#expirada-confirm-password`. **CONFIRMADO_UI** no newfront em 2026-11-05 com a massa ADMINISTRADOR.
7. Recuperação: "Esqueceu a senha?" → "Redefinir senha", `#recuperacao-usuario`. Um teste permanece `test.fixme` (GET 500).
8. Logout (mock): menu usuário → Sair → modal Sim/Não.

## Perfil Master

Não confirmado. Massa segura: `perfil=ADMINISTRADOR`. Roles mockadas em `NOVA_UX_SESSION_ROLES` incluem `CONTRATO_EDITAR` e `IMAGEM`, **não** listam `IMAGEM_UPLOAD` nem role `MASTER`.

## Sessão

localStorage: `token`, `currentUser`, `roles`, `expiration_token`, `session_time`. Sem `storageState` commitado — correto. Expiração real **NÃO_ANALISADA** (bloqueio de senha).

Não registrar cookies, tokens ou senhas. Evidence: `evidence/live-inspect.json` (sem segredos).
