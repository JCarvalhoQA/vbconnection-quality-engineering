# Lote 5 — implementação

Specs: `e2e/contratos/page02/{ma,to}-estrutural.spec.ts` via `definirTestesEstruturaisPage02`.

Destinos: MA=238 (inventário), TO=122 (inventário + Java + `DetranUf`).

MA: mock `/form/*` via `formMockFromUiProfile` (`origem: LIVE_FIELD_INVENTORY`, `fonteJava: ausente`). Sem `fixtures/matriz/MA.json`.

Live `assertCascaPorInventario` inclui `assertEspecificosMa` (pagamento/juros + TG + tipoEspecie).

## Executado (mocked)

Lote 5: **2 passed** (10.4s).  
19 UFs anteriores: **19 passed** (36.1s).  
Completa: **100 passed / 3 skipped / 0 failed / 0 flaky** (2.8m).

## Não executado

Live-readonly MA/TO. Etapa 13.
