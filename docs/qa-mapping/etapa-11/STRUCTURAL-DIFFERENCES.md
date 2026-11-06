# Diferenças estruturais RR / RS / SC / SP

Fonte visual: `LIVE-FIELD-INVENTORY.json` (GATE3).  
Fonte Java: `fixtures/matriz/{UF}.json`. Fontes **não** equalizadas.

| Característica | RR | RS | SC | SP |
|---|---|---|---|---|
| Formulário live | Sim | Sim | Sim | Sim |
| idCombo | 11 | 231 | 4 | 1 |
| Campos visuais | 49 | 54 | 47 | 50 |
| `*` visuais | 25 | 24 | 20 | 26 |
| Terceiro Garantidor (UI) | Ausente | Ausente | Ausente | Ausente |
| TG na matriz Java | false | false | false | false |
| Novo/usado (UI) | Ausente | Ausente | Ausente | Ausente |
| `INDICA_NOVO_USADO` Java | oculto | oculto | oculto | oculto |
| Zero km default | Sim | Sim | Sim | Sim |
| Placa/RENAVAM (não zero km) | uf, placa, renavam | uf, placa, renavam | uf, placa, renavam | uf, placa, renavam |
| Gravame / chassi `*` | Sim | Gravame e tipoChassi **sem** `*` | Sim | Sim |
| tipoEspecie | Ausente | Ausente | Ausente | Ausente |
| Cor | Presente, sem `*` | Ausente na linha zero km | Presente, sem `*` | Presente, sem `*` |
| Credor | Sim | Sim | Sim | Sim |
| Documentos | Sim | Sim | Sim | Sim |

## Particularidades

- **RR:** Devedor `Complemento*` obrigatório visual; Índice `*`; linha de veículo com `idMarcaModelo` + marca/modelo/versão/combustível/categoria/cor/UF licenciamento.
- **RS:** Tipo e Forma de Contrato + Data do cadastro (sem `*`); veículo mais enxuto (sem marcaBem/cor); gravame, tipoChassi, ano e modelo sem `*` visual.
- **SC:** sem Código DETRAN no agente; campo `Registro SIRCOF`; taxas de juros mês/ano com `*`; liberação de crédito e vencimentos **sem** `*`.
- **SP:** `Início vigência*` e `Fim vigência*`; Índice `*`; sem `ufLicenciamento` na linha zero km.

## Divergências registradas

| Campo / tema | Observado | Fonte | Classe |
|---|---|---|---|
| Contagens Java × live | Diferem; não equalizadas | UI GATE3 vs `fixtures/matriz` | UI/Java |
| TG e Novo/usado | Coincidem (ausentes nas duas fontes) | UI + Java | Alinhado |
| Gravame RS sem `*` | Inventário live `requiredVisual=false`; Java `NUMERO_RESTRICAO` visível não obrigatório | UI + Java | Alinhado na obrigatoriedade; não forçado |
