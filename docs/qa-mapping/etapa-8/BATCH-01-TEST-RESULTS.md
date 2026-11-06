# Lote 1 — resultados

UFs: AC, AP, DF, ES.

## Seleção (`--list`)

Live PAGE-02 (`--grep @live-readonly`): **7 testes** (baseline 3 + lote 1 4).  
Mocked PAGE-02: **7 testes**.  
`ci-select` `ufs=AC,AP,DF,ES` suite=structural mocked: apenas os 4 arquivos do lote 1; sem `registro/*.spec.ts`.

## Mocked

PAGE-02 completo (7): **7 passed** (18,9s).  
Lote 1 (AC/AP/DF/ES): **4 passed** (incluídos no 7).

## Live-readonly

**Não executado.** Gates: merge em `main`, Environment `live-readonly`, **rotação da credencial Master não confirmada** (bloqueio).

## TypeScript / unitários

`typecheck` exit 0 · unitários **64 passed**.
