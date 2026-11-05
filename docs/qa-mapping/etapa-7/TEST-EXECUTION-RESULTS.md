# Resultados de execução — Etapa 7

## TypeScript e unitários

| Comando | Resultado |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run test:unit` | **59 passed** |
| `npm run matriz:compare` | overlap=20 mismatch=0 |
| `node scripts/validate-pipeline-local.mjs` | canários ok |

## Seleção Playwright (`--list`)

Live estrutural (`e2e/contratos/page02 --grep @live-readonly`): **3 testes** (BA, CE, RO).  
Mocked estrutural (`--grep @mocked` no mesmo path): **3 testes**.  
Grep vazio: `Error: No tests found` · exit 1.

## Estabilidade VA-1774

`--repeat-each=10 --retries=0 --workers=1`: **10 passed** (1,0 min).

## Estrutural mockado BA/CE/RO

**3 passed** (9,5s). Sem Registrar.

## Regressão mockada local

```text
npx playwright test --project=vbconnection-newfront --grep-invert @live-readonly --retries=0
85 tests · 82 passed · 3 skipped · 0 failed · 0 flaky · 2.8m
```

Skipped conhecidos: 2× SE (sem formulário) + 1 login recuperação 500.

Os +2 em relação à regressão anterior (83 contabilizados) são os estruturais mocked CE e RO.

## Live-readonly nesta etapa

**Não executado na CI.** Critério: só após revisão do PR e confirmação das proteções do Environment. O Environment ainda está sem reviewers e sem restrição de branch (ver `CI-SECURITY-AUDIT.md`).
