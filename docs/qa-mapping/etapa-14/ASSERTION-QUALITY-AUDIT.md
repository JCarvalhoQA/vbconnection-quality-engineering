# Auditoria de qualidade das assertions — Etapa 14

**Evidência:** `assertCascaMockadaPorInventario`, `formSource: 'ui'` na factory PAGE-02, canário BA/CE e 21/21 mocked local.

Forte = observa a propriedade no DOM. Parcial = só um lado da regra. Ausente = não existe.

| # | Verificação | Mocked | Live | Notas |
|---|---|---|---|---|
| 1 | Remoção de campo esperado obrigatório | Forte (casca mapeada + veículo) | Forte | `camposCascaAssertaveis` + chassi/gravame/placa |
| 2 | Inclusão indevida de campo | Parcial (TG, Novo/usado, tipoEspecie) | Parcial | Cor e motor extras ainda não falham |
| 3 | Alteração de obrigatoriedade visual | Forte (casca mapeada) | Forte | `alter-asterisk` mocked agora detectado |
| 4 | Remoção de seção | Forte (mínimas + headings renderizáveis via `/form`) | Forte | Documentos fora do mock de headings |
| 5 | Exibição indevida de seção | Parcial (TG + Credor) | Parcial | Documentos mocked não é sinal estável |
| 6 | Valor inicial Zero km | Forte | Forte | |
| 7 | Alternância Zero km | Forte | Forte | |
| 8 | Ausência de Placa/RENAVAM quando aplicável | Forte | Forte | |
| 9 | Presença indevida de Novo/usado | Forte | Forte | |
| 10 | Ausência de TG quando esperado | Forte | Forte | |
| 11 | Exibição indevida de TG | Forte | Forte | |
| 12 | Alteração inesperada do Credor | Forte (heading via `/form/credor`) | Forte (heading) | Campos internos do credor entram na casca mapeada |
| 13 | Seção Documentos | Não assertada (BA some, CE aparece) | Forte (heading do inventário) | Sem endpoint `/form/documentos` |
| 14 | Falha no descarte de veículo | Forte | Forte | |
| 15 | Formulário de outra UF | Parcial (nome do destino) | Parcial | Swap BA↔CE detectado |

## Impacto

Os 42 sobreviventes da Etapa 13 (`alter-asterisk` e `remove-required-field` no mocked) passam a ser observados no DOM, não só no oráculo.

## Recomendação

Não promover mocked a paridade live: Documentos, `agenteFinanceiroCadastro` e campos sem `CAMPO_POR_ID` continuam lacunas.

## Status

Assertions mocked de casca fortalecidas nesta etapa. Live sem mudança de contrato.

## Limitação

Oráculo de mutação não abre browser; espelha o código das assertions. `agenteFinanceiroCadastro` não entra em `camposCascaAssertaveis`.
