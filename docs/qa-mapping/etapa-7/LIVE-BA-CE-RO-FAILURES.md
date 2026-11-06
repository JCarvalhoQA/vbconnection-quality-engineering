# Correção live-readonly BA/CE/RO

**Run analisado:** https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42220549160  
**Resultado original:** 1 passed (BA), 2 failed (CE, RO) · 2 workers · `main` @ `2e6b5ba`

## Causa-raiz — CE (`prefs2` 401)

Não é falha específica do DETRAN-CE. O teste CE isolado, com o mesmo código da `main`, **passou** (16,0s) contra `newfront`.

Na CI, Playwright rodou **3 testes / 2 workers**. BA e CE autenticaram o **mesmo** usuário Master em paralelo. Tokens do CE retornaram 200; o GET `/auth/prefs2` seguinte ficou em 401 por 30s. O snapshot final ainda era a tela de login, com HTML Tomcat 401 no formulário.

RO começou **depois** de BA terminar (worker liberado) e autenticou com sucesso — confirma que a sessão Master não admite dois logins simultâneos.

Correções:

- `PLAYWRIGHT_MODE=live-readonly` força `workers: 1`, `fullyParallel: false`, `retries: 0`.
- Job live da Actions passa `--workers=1 --retries=0`.
- `installAuthCapture` ignora `prefs2` 401 **antes** de tokens 200 (sonda anônima da SPA). Depois de tokens 200, 401 continua sendo falha.
- Paralelismo live **não** volta até existir isolamento de sessão Master comprovado (hoje não há).

HTTP 401 **não** é tratado como sucesso. Autenticação continua Master real, sem mock.

## Causa-raiz — RO (locator duplicado)

`assertEspecificosRo` usava `locator('#dataContrato')`. O NG-ZORRO replica o `id` no `nz-date-picker` **e** no `input` interno. Strict mode: 2 elementos.

Correção: `campoControle` / `assertCampoUnicoVisivel` — host `nz-date-picker#id` no article da seção, ou `getByRole('textbox'|'combobox')` com o rótulo. Sem `.first()` / `.nth()`. O mesmo helper cobre date-picker/select de CE e Terceiro Garantidor.

## Segurança do artifact

O `error-context.md` do run 42220549160 dumpava o valor do campo senha no snapshot de acessibilidade. O artifact **foi excluído**. O job live agora:

- sanitiza `error-context.md` / HTML / JSON / Markdown antes do upload;
- **não** envia `trace.zip` nem vídeo (DOM do login contém o valor digitado).

Relatórios HTML/JSON/JUnit permanecem.

## Validação local (autorizada, persistGuard ligado)

Detalhe em `LIVE-FIX-EXECUTION.md`.

| Execução | Resultado |
|---|---|
| CE isolado **antes** do patch de locator, `workers=1` | **1 passed** (16,0s) — prova o 401 da CI |
| Typecheck / unitários / `--list` | exit 0 · 63 passed · 3 testes live |
| PAGE-02 mocked | 3 passed |
| CE isolado após o patch | **1 passed** (12,7s) |
| RO isolado após o patch | **1 passed** (11,5s) |
| Suíte BA/CE/RO `workers=1` | **3 passed** (37,2s) |
| Live CI após merge | **não disparada** neste PR |

Persistência: os specs live instalam `persistGuard` e `assertSemPersistenciaDefinitiva`. Nenhum `contratos/registrar`.

A correção local está verde. A confirmação no GitHub Actions só vale depois do merge em `main` e de um dispatch `mode=live-readonly` / `suite=structural` / `target=newfront`.
