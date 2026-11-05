# Checklist de segurança — execução live-readonly

Escopo: inspeção estrutural PAGE-02 BA em `https://newfront.vbconnection.info/`, perfil Master, sem persistência de negócio.

## Autenticação

| Item | Status | Evidência |
|---|---|---|
| Credenciais Master só no Environment `live-readonly` | OK (após correção operacional) | `gh secret list --env live-readonly` lista `PLAYWRIGHT_MASTER_USER` e `PLAYWRIGHT_MASTER_PASSWORD` (nomes e timestamp). Repo secrets: vazio |
| Job mocked não recebe Master | OK | job `mocked` não declara `environment` nem `env.PLAYWRIGHT_MASTER_*` |
| PRs não disparam live | OK | `if` do job + `ci-select` recusa `pull_request` + live |
| Perfil efetivo `MASTER` | OK no código | job seta `PLAYWRIGHT_MASTER_PERFIL: MASTER`; `assertMasterProfile` falha se a API não devolver `MASTER` |
| Sem autenticação mockada no describe live | OK | `mockLoginApis` / `seedAuthenticatedSession` só no describe `@mocked` |
| Token/cookie/senha fora dos logs | OK no código | `sanitizeEvidenceText` redige Bearer, password, e-mail, CPF/CNPJ; `installPersistAttemptLog` redige query `token/password` |

Valores de secret **não** foram impressos neste diagnóstico. O `.env` local do repositório QE **não existe**; as chaves foram copiadas para o Environment a partir do `.env` de desenvolvimento, só via `gh secret set` (stdin).

## persistGuard

Instalação no spec live (`ba-estrutural.spec.ts`):

```ts
test.beforeEach(async ({ page }) => {
  await installPersistGuard(page, { mode: 'live-readonly' });
});
```

Isso ocorre **antes** de `login.goto()` e de qualquer navegação PAGE-02.

| Operação | Esperado live-readonly | Código |
|---|---|---|
| POST `/api/contratos/registrar` | abort | `shouldAbortPersist` true; `shouldFallbackRegistrar` false |
| POST/PUT/PATCH/DELETE `/api/*` (exceto auth allowlist) | abort | `isApiUrl` |
| Upload / lote / aditivo / imagem / B3 / enviodocumento | abort | `PERSIST_URL_PATTERN` |
| GET destinos-combo / consultas | libera | GET não está em `MUTATING` |
| POST `/auth/tokens` | libera | `isAuthAllowlist` + `matchesGuardRoute` ignora `/auth/` |

Unitário: `tests/persistGuard.test.ts` → `live-readonly aborta registrar e demais mutações /api/, mas libera auth`.

O spec ainda chama `assertSemPersistenciaDefinitiva` e descarta a linha de veículo sem clicar em Registrar.

## Limites conhecidos do guard (não escondidos)

Documentados em `support/persistGuard.ts`:

- outros `BrowserContext`
- WebSocket
- submit de formulário nativo para origem fora do padrão interceptado
- `page.route` instalado **depois** do guard (LIFO)

O piloto estrutural usa um único context, HTTP(S) da SPA e o guard no `beforeEach`. Não cobre um segundo context aberto pelo teste.

## Environment GitHub

| Campo | Valor |
|---|---|
| Nome | `live-readonly` |
| Existia antes? | Não (404) |
| Criado em | 2026-11-05T18:14:03Z (id `26395630297`) |
| Protection rules | nenhuma (admins bypass default) |
| Deployment branch policy | null (qualquer branch do repo pode usar o environment) |
| Aprovação manual | não exigida neste momento |

Sem Environment + secrets, o disparo live **iniciaria** o job e falharia em `ci-select` — não ficaria skipped. Essa lacuna foi a única correção necessária para a execução autorizada, e foi de configuração GitHub, não de YAML.

## O que esta execução não faz

- Não registra contrato no DETRAN/B3.
- Não envia lote, imagem ou gravame.
- Não altera/exclui contrato persistido.
- Não mistura fixtures `@mocked` na suíte live estrutural.
- Não promove o job live a check obrigatório de Pull Request.
