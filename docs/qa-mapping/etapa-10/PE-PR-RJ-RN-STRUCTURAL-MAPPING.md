# Mapeamento estrutural PE / PR / RJ / RN

Fonte visual: `LIVE-FIELD-INVENTORY.json` (GATE3).  
Fonte Java: `fixtures/matriz/{UF}.json`. Fontes **não** equalizadas.

| Característica | PE | PR | RJ | RN |
|---|---|---|---|---|
| Formulário live | Sim | Sim | Sim | Sim |
| idCombo | 3 | 10 | 16 | 228 |
| Campos visuais | 47 | 64 | 70 | 47 |
| `*` visuais | 24 | 22 | 25 | 30 |
| Terceiro Garantidor | Ausente | Presente, 12 campos, sem `*` | Presente, 12 campos, sem `*` | Ausente |
| Novo/usado | Ausente | Ausente | Ausente | Ausente |
| Zero km default | Sim | Sim | Sim | Sim |
| Placa/RENAVAM (não zero km) | uf, placa, renavam | uf, placa, renavam | uf, placa, renavam | uf, placa, renavam |
| tipoEspecie | Ausente | Presente, sem `*` | Presente, sem `*` | Ausente |
| Cor (descricaoCorVeiculo) | Presente, sem `*` | Presente, sem `*` | Presente, **com `*`** | Ausente na linha zero km |
| Credor | Sim | Sim | Sim | Sim |
| Documentos | Sim | Sim | Sim | Sim |
| TG na matriz Java | false | true | true | false |

Divergência registrada: contagens Java × live diferem; TG e Novo/usado coincidem entre as duas fontes nestas quatro UFs. Não houve alteração para forçar equivalência.
