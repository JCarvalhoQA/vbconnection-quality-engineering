# Execução — correção live BA/CE/RO

## Comandos de qualidade

| Comando | Resultado |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run test:unit` | **63 passed** |
| `playwright test e2e/contratos/page02 --grep @live-readonly --list` | **3 testes** (BA, CE, RO) |
| PAGE-02 `@mocked` | **3 passed** (8,9s) |

## Live autorizado (local, persistGuard, Master real)

Ambiente: `https://newfront.vbconnection.info` · `PLAYWRIGHT_MODE=live-readonly` · `workers=1` · `retries=0`

| Execução | Resultado |
|---|---|
| CE isolado **antes** do patch de locator (prova do 401 da CI) | **1 passed** (16,0s) |
| CE isolado após o patch | **1 passed** (12,7s) |
| RO isolado após o patch | **1 passed** (11,5s) |
| Suíte BA/CE/RO `workers=1` | **3 passed** (37,2s) |

Nenhum `contratos/registrar`. Specs live instalam `persistGuard` e `assertSemPersistenciaDefinitiva`.

## GitHub Actions

Live CI **não** foi redisparada neste PR. Critério: depois da revisão, merge em `main` e aprovação do Environment `live-readonly`.

Run anterior: https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42220549160 (1 passed / 2 failed). Artifact com snapshot de login **excluído**.
