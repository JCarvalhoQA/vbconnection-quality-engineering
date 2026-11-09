# Lacuna Java de Maranhão — Etapa 14

**Evidência:** `hasMatrizFixture('MA') === false`; `formMockFromUf('MA')`; suíte estrutural PAGE-02 mocked MA passou localmente.

## O que existe

| Fonte | MA |
|---|---|
| Formulário live | Sim (idCombo 238, 68 campos, 25 `*`) |
| Terceiro Garantidor | 12 campos, sem `*` |
| tipoEspecie | Presente, sem `*` |
| Pagamento/juros | UF/cidade/data/época/taxa mês com `*` |
| `fixtures/matriz/MA.json` | **Não existe de propósito** |
| Mock `/form/*` estrutural | `formMockFromUiProfile` (`origem: LIVE_FIELD_INVENTORY`, `fonteJava: ausente`) |

## O que não é

A ausência da matriz Java **não** é defeito da aplicação. Não foi criada fixture artificial nesta etapa.

`matriz:compare` permanece `overlap=20 mismatch=0 missing=0 extra=0`. MA fora do overlap.

## Cobertura efetiva

Mocked estrutural: mesmo caminho das outras 20 UFs (`formSource: 'ui'`), casca mapeada + TG + tipoEspecie + veículo.  
Live: **MA_TO_LIVE_PENDING** — nenhum `workflow_dispatch` live após o PR #11.

## Classificação

Fonte UI: `CONFIRMADA_LIVE`. Fonte Java: **ausente**. Categoria live: `IMPLEMENTED_NOT_EXECUTED` / `MA_TO_LIVE_PENDING`.

## Impacto / recomendação / status / limitação

Impacto: rastreio Java×UI impossível para MA.  
Recomendação: se o produto publicar `MatrizDadosMA`, versionar fixture pelo script oficial — não copiar o inventário live.  
Status: lacuna preservada; mock UI reforçado.  
Limitação: `uiFormMock` mapeia ids conhecidos; campo live sem id estável não vira célula Java.
