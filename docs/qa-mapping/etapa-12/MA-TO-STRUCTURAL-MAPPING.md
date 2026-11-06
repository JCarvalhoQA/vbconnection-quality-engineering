# Mapeamento estrutural MA × TO

Fonte visual: `LIVE-FIELD-INVENTORY.json` (GATE3).  
Fonte Java: `fixtures/matriz/TO.json`. **MA não possui fixture Java** — cobertura estrutural só UI.

| Característica | MA | TO |
|---|---|---|
| Formulário live | Sim | Sim |
| idCombo | 238 | 122 |
| Campos visuais | 68 | 48 |
| `*` visuais | 25 | 16 |
| Matriz Java | **Ausente** | Presente |
| Terceiro Garantidor | 12 campos, sem `*` | Ausente |
| Novo/usado | Ausente | Ausente |
| Zero km default | Sim | Sim |
| Placa/RENAVAM (não zero km) | uf, placa, renavam | uf, placa, renavam |
| tipoEspecie | Presente, sem `*` | Ausente |
| Gravame `*` | Sim | Sim |
| Chassi `*` | Sim | Sim |
| Credor | Sim | Sim |
| Documentos | Sim | Sim |

## Particularidades MA

- Local de pagamento (UF/cidade `*`), Data de pagamento `*`, Época de pagamento `*`, Taxa juros mês `*`.
- Devedor Celular `*`; Nome do agente sem `*`.
- Tipo de Contrato visível sem `*`; vigências sem `*`.
- Taxa administrativa nos complementares.

## Particularidades TO

- Formulário mais enxuto (16 `*`).
- Liberação de crédito, parcelas e financiamento **sem** `*` visual.
- Sem TG, sem tipoEspecie, sem Código DETRAN obrigatório.

## Divergências

| Tema | Observado | Fonte | Classe |
|---|---|---|---|
| MA sem coluna Java | Inventário `matrizJava=false`; `fixtures/matriz/MA.json` inexistente | UI GATE3 | Limitação da evidência Java — **não inventada** |
| Contagens Java × UI (TO) | Diferem; não equalizadas | UI vs `TO.json` | UI/Java |
| TG MA | Só UI; 12 campos sem `*` | LIVE_FIELD_INVENTORY | UI sem par Java |
