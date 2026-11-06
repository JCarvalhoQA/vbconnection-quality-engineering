# Lacuna Java de Maranhão — Etapa 13

**Evidência:** `hasMatrizFixture('MA') === false`; `loadUfUiProfile('MA')`; `support/uiFormMock.ts`; `assertEspecificosMa`.

## O que existe

| Fonte | MA |
|---|---|
| Formulário live | Sim (idCombo 238, 68 campos, 25 `*`) |
| Terceiro Garantidor | 12 campos, sem `*` |
| tipoEspecie | Presente, sem `*` |
| Pagamento/juros | UF/cidade/data/época/taxa mês com `*` |
| `fixtures/matriz/MA.json` | **Não existe de propósito** |
| Mock `/form/*` | `formMockFromUiProfile` (`origem: LIVE_FIELD_INVENTORY`, `fonteJava: ausente`) |

## O que não é

A ausência da matriz Java **não** foi classificada como defeito da aplicação. É lacuna da evidência Java disponível ao repositório independente. Não foi criada fixture artificial.

`matriz:compare` continua `overlap=20 mismatch=0`. MA fora do overlap.

## Cobertura efetiva

Live assertions (quando executadas): casca do inventário + pagamento/juros + TG + tipoEspecie.  
Mocked: seções mínimas + TG + veículo. Motor aparece no DOM mockado mesmo sem `numeroMotor` no inventário — ausência de motor **não** é assertada (falso negativo evitado).

## Classificação

Fonte UI: `CONFIRMADA_LIVE`. Fonte Java: **ausente**. Categoria live: `IMPLEMENTED_NOT_EXECUTED`.

## Impacto / recomendação / status / limitação

Impacto: rastreio Java×UI impossível para MA.  
Recomendação: se o produto publicar `MatrizDadosMA`, versionar fixture gerada pelo script oficial — não copiar o inventário live para Java.  
Status: lacuna registrada; mock UI preservado.  
Limitação: `uiFormMock` mapeia ids conhecidos; campo live sem id estável não vira célula Java.
