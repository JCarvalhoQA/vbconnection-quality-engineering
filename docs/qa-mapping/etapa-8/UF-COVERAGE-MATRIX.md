# Matriz de cobertura PAGE-02

Fonte de presença/obrigatoriedade visual: `LIVE-FIELD-INVENTORY.json`.  
Matriz Java: `fixtures/matriz/*.json` (backend). As duas fontes **não** foram equalizadas.

Status estrutural ≠ homologação funcional.

| UF | Formulário live | Perfil UI | Mocked estrutural | Live estrutural | Registro mocked | Status |
|---|---|---|---|---|---|---|
| BA | Sim | Sim | Sim | Sim (baseline CI) | Sim | Baseline |
| CE | Sim | Sim | Sim | Sim (baseline CI) | Não | Baseline |
| RO | Sim | Sim | Sim | Sim (baseline CI) | Não | Baseline |
| AC | Sim | Sim | Sim (lote 1) | Implementado, não executado live | Sim | Lote 1 |
| AP | Sim | Sim | Sim (lote 1) | Implementado, não executado live | Sim | Lote 1 |
| DF | Sim | Sim | Sim (lote 1) | Implementado, não executado live | Sim | Lote 1 |
| ES | Sim | Sim | Sim (lote 1) | Implementado, não executado live | Sim | Lote 1 |
| MG | Sim | Sim | Não | Não | Sim | Lote 2 planejado |
| MS | Sim | Sim | Não | Não | Sim | Lote 2 planejado |
| MT | Sim | Sim | Não | Não | Sim | Lote 2 planejado |
| PB | Sim | Sim | Não | Não | Sim | Lote 2 planejado |
| PE | Sim | Sim | Não | Não | Sim | Lote 3 planejado |
| PR | Sim | Sim | Não | Não | Sim | Lote 3 planejado |
| RJ | Sim | Sim | Não | Não | Sim | Lote 3 planejado |
| RN | Sim | Sim | Não | Não | Sim | Lote 3 planejado |
| RR | Sim | Sim | Não | Não | Sim | Lote 4 planejado |
| RS | Sim | Sim | Não | Não | Sim | Lote 4 planejado |
| SC | Sim | Sim | Não | Não | Sim | Lote 4 planejado |
| SP | Sim | Sim | Não | Não | Sim | Lote 4 planejado |
| MA | Sim | Sim (Java ausente) | Não | Não | Não | Lote 5 planejado |
| TO | Sim | Sim | Não | Não | Sim | Lote 5 planejado |
| SE | **Não** | Inventário: form indisponível | Não | Não | Skip conhecido | Exceção |

## Lote 1 — diferenças observadas no inventário live

| UF | TG | Novo/usado | Credor | Documentos | Zero km default | Evidência |
|---|---|---|---|---|---|---|
| AC | Ausente | Ausente | Sim | Sim | Sim | GATE3 |
| AP | Ausente | Ausente | Sim | Sim | Sim | GATE3 |
| DF | Ausente | Ausente | Sim | Sim | Sim | GATE3 |
| ES | Presente (12 campos, sem `*` visual) | Ausente | Sim | Sim | Sim | GATE3 |

Gravame no ES: visível, asterisco visual **não** marcado no inventário (diferente de AC/AP).
