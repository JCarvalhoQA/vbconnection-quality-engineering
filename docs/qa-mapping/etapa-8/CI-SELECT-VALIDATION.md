# ci-select — validação Etapa 8

## Regras

- `PLAYWRIGHT_UFS` só com `suite=structural`.
- Allowlist implementada: AC, AP, BA, CE, DF, ES, RO.
- Rejeita SE, lote 2+, tokens inválidos.
- Monta lista de arquivos `e2e/contratos/page02/{uf}-estrutural.spec.ts` + `--grep @mocked` ou `@live-readonly`.
- Não seleciona `e2e/contratos/registro`.
- Live em `pull_request`: exit 2.
- Target `hmg`: exit 2.

## Canários (`validate-pipeline-local.mjs`)

| Caso | Esperado | Resultado |
|---|---|---|
| PR + live | exit 2 | ok |
| target hmg | exit 2 | ok |
| mocked regression | `--grep-invert @live-readonly` | ok |
| ufs=AC,AP,DF,ES structural mocked | 4 specs lote 1 | ok |
| ufs=SE | exit 2 | ok |
| ufs em regression | exit 2 | ok |
