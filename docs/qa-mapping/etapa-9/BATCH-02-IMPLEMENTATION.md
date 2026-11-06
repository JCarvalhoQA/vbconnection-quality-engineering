# Lote 2 — implementação MG / MS / MT / PB

IDs do combo (inventário live = `idCombo`): MG 9, MS 226, MT 233, PB 13.

| UF | Campos live | `*` visuais | TG | Novo/usado | Zero km default | Credor | Documentos | Evidência |
|---|---|---|---|---|---|---|---|---|
| MG | 49 | 25 | Ausente | Ausente | Sim | Sim | Sim | GATE3 |
| MS | 48 | 27 | Ausente | Ausente | Sim | Sim | Sim | GATE3 |
| MT | 45 | 17 | Ausente | Ausente | Sim | Sim | Sim | GATE3 |
| PB | 47 | 25 | Ausente | Ausente | Sim | Sim | Sim | GATE3 |

Matriz Java: `DADOS_TERCEIRO_GARANTIDOR=false` e `INDICA_NOVO_USADO` oculto nas quatro — alinhado à UI nestes dois pontos. Contagens de campos Java × live continuam diferentes (ex.: MG Java 66 vs live 49); as fontes não foram alteradas para coincidir.

Specs: `e2e/contratos/page02/{mg,ms,mt,pb}-estrutural.spec.ts` via `definirTestesEstruturaisPage02`.  
CE/RO/MA permanecem fora da suíte de **registro** persistente.

## Executado (mocked)

PAGE-02 lote 2: 4 passed (incluídos nos 11 estruturais mocked).

## Não executado

Live-readonly MG/MS/MT/PB.
