# Lote 4 — implementação

Specs: `e2e/contratos/page02/{rr,rs,sc,sp}-estrutural.spec.ts` via `definirTestesEstruturaisPage02`.

Tags: `@contrato @page02 @rr|@rs|@sc|@sp @mocked` e `@live-readonly`.

Destinos: RR=11, RS=231, SC=4, SP=1 (`LIVE-FIELD-INVENTORY` + `generate-matriz-fixtures.mjs`).

## Executado (mocked)

PAGE-02 lote 4: **4 passed** (12.6s).  
Baseline 15 UFs mocked: **15 passed** (28.6s).  
Regressão mockada completa: **98 passed / 3 skipped / 0 failed / 0 flaky** (2.8m).

## Não executado

Live-readonly RR/RS/SC/SP (PR e feature branch). Lote 5.

## Reuso

Sem Page Object por UF. `VeiculoSection.expectCampoInventario` cobre espécie/cor só quando o inventário lista o campo (nenhuma das quatro UFs tem `tipoEspecie`).
