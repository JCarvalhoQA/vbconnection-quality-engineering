# Autenticação Master — preparação (sem executar)

ADMINISTRADOR **não** equivale a Master. São valores distintos de `PerfilEnum` (`MASTER` vs `ADMINISTRADOR`). Roles de sessão mockada (`NOVA_UX_SESSION_ROLES`) começam com `ADMINISTRADOR` e **não** incluem `MASTER`.

## Estado atual

| Item | Situação |
|---|---|
| `.env` Playwright | ausente no checkout (correto; está no `.gitignore`) |
| `.env.example` | só overlay `PLAYWRIGHT_USER` / `PLAYWRIGHT_PASSWORD` da persona **admin** |
| `login.mass.json` | `perfil: ADMINISTRADOR` |
| Overlay | `fixtures/login.ts` aplica env **em cima** da persona admin |
| Newfront 2026-11-05 | essa persona autentica e cai em **Alterar senha** |
| Troca de senha | **não** realizada (mutação de conta) |
| `storageState` | não usado; pasta `.auth/` já ignorada pelo git |
| Master no projeto | **nenhuma** variável, massa ou persona |

Usar `PLAYWRIGHT_USER` para Master misturaria perfis e quebraria o contrato “admin ≠ master”.

## Schema no `.env.example` (valores só no `.env` local)

Preparação de código: `e2e/gate0/inspect-page02-ba.spec.ts` + `support/liveInspect.ts`. **Não executar** sem `PLAYWRIGHT_GATE0_LIVE=1` e autorização.

## Schema proposto (local, nunca commitado)

Arquivo: `.env` na raiz deste repositório (já coberto por `.gitignore`: `.env`, `.env.*`, `!.env.example`).

```
# Master — homologação. Não versionar.
PLAYWRIGHT_MASTER_USER=
PLAYWRIGHT_MASTER_PASSWORD=
PLAYWRIGHT_MASTER_NAME=
PLAYWRIGHT_MASTER_EMAIL=
PLAYWRIGHT_MASTER_PERFIL=MASTER

# Estado de sessão gerado localmente após login Master bem-sucedido
PLAYWRIGHT_MASTER_STORAGE_STATE=.auth/master.json

# Liga o spec Gate 0 (default: ausente/0 = skip)
PLAYWRIGHT_GATE0_LIVE=0
```

Regras:

1. Não gravar senha em markdown, JSON de evidência, Allure, JUnit, traces commitados.
2. Traces/screenshots de falha de login: mascarar value de password (config Playwright `context` — só na implementação aprovada).
3. `PLAYWRIGHT_MASTER_PERFIL` deve ser lido de `/auth/prefs2` após login e **comparado**; se não for `MASTER`, abortar a suíte live.
4. Persona `admin` permanece para testes **mockados**. Live newfront de PAGE-02..08 só com Master.
5. Não reutilizar a senha expirada do ADMINISTRADOR. Não pedir ao agente para alterar senha.
6. 2FA Master: se a conta exigir, documentar bloqueio; não burlar.

## Fluxos (plano, não código)

### A — Testes mockados (já existem)

`mockLoginApis` + `seedAuthenticatedSession`. Sem `.env` Master. Sem POST real. Continua sendo o caminho de CI até o Gate 0.

### B — Testes live somente leitura (futuro)

1. Login UI com variáveis Master.
2. Assert `prefs2.perfil.perfil === 'MASTER'` (ou campo equivalente).
3. Gravar `storageState` em `.auth/master.json` (gitignore).
4. Projetos Playwright: `setup-master` → `newfront-master` depends on setup.
5. Rotas autenticadas via `gotoApp` (nunca deep link HTTP).
6. `page.route` abortando `POST|PUT|DELETE|PATCH` em `contratos/registrar`, upload de lote/imagem, salvar aditivo.

### C — O que não fazer

- `seedAuthenticatedSession` com role `MASTER` **não** prova autorização real.
- Login ADMINISTRADOR “para ver as telas” **não** satisfaz o pedido Master (menus/cliente obrigatório em relatórios diferem).
- Commit de `.auth/*.json` (token).
- Contornar 2FA, certificado ou captcha.

## Critério de aceite da credencial (Gate 0)

A conta só é aceita quando **todas** forem verdadeiras:

1. Fornecida fora do git (gestor/QA), colada só no `.env` local.
2. Login chega na home (`Bem-vindo`), não em Alterar senha nem 2FA não documentado.
3. Perfil retornado = `MASTER`.
4. Role `CONTRATO_EDITAR` presente se PAGE-02 for o alvo (Master sem a role → registrar o bloqueio, não inventar bypass).
5. Nenhuma senha aparece em `live-inspect.json` / relatórios.

Enquanto 1–4 falharem, PAGE-02..08 live permanecem **BLOQUEADAS**. A preparação documental da etapa 2 está completa mesmo assim.
