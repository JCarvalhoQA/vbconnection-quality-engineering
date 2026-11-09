# Lacunas mocked × live — Etapa 14

**Evidência:** canário BA (Documentos ausente), canário CE (Documentos presente), `uiFormMock.ts`, `assertCascaMockadaPorInventario` vs `assertCascaPorInventario`.

| Lacuna | Live | Mocked | Causa | Tratamento |
|---|---|---|---|---|
| Asterisco de casca | Inventário completo | Campos com `CAMPO_POR_ID` | `/form/*` só entende chaves Java | Payload UI + mapeamento `INDICE_SIGLA` / `MORA_TAXA` / etc. |
| `agenteFinanceiroCadastro` | `*` no combo Agente | Não iterado na casca mocked | Sem chave Java estável no mapa | Documentado; mutação usa outro obrigatório mapeado |
| Documentos | Heading do inventário | BA some; CE aparece | Sem `/form/documentos` | Mocked **não** asserta presença nem ausência |
| Credor | Heading + campos | Heading + campos mapeados | `/form/credor` existe | Assertado pelo inventário |
| tipoEspecie fora do inventário | Ausente | Precisa `[false, false]` no payload | Chave omitida = Angular mostra o combo | `VEICULO_POR_CONTROL` ausente é ocultado |
| numeroMotor extra | Ausente no inventário BA | Pode aparecer no DOM | Limitação Angular (Etapa 13) | Ausência **não** assertada |
| MA Java | Sem matriz | `uiFormMock` | Produto sem `MatrizDadosMA` no repo | Não inventar `MA.json` |
| SE form | Indisponível | Skip | GATE3 sem form | Sem mock estrutural |
| Registro persistente | Fora do PAGE-02 | Continua `java-or-ui` | Factory de registro ≠ estrutural | Matriz Java intocada |

## O que esta etapa não fez

Não alterou `fixtures/matriz/*.json` para copiar a UI. Não declarou 21/21 live. Não disparou live.

## Impacto / recomendação / status / limitação

Impacto: mocked estrutural agora observa `*` da casca mapeada; Documentos continua fora do sinal de mutação.  
Recomendação: se o Newfront expor `/form/documentos`, aí sim assertar o heading pelo inventário.  
Status: lacunas registradas após 21/21 PAGE-02 mocked local.  
Limitação: presença de Documentos no mocked é UF-dependente e não é SoT.
