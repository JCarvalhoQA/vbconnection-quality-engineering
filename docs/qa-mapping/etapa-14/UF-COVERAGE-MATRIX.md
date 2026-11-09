# Matriz de cobertura efetiva PAGE-02 — Etapa 14

Status estrutural ≠ homologação funcional, ≠ DETRAN/B3. **Não declarar 21/21 live.**

Categorias: `IMPLEMENTED_NOT_EXECUTED` · `MOCKED_PASSED` · `LIVE_READONLY_PASSED` · `NOT_APPLICABLE` · `BLOCKED`.

| UF | Campos | `*` | TG | Novo/usado | tipoEspecie | Mocked | Live | Categoria live | Evidência live |
|---|---:|---:|---|---|---|---|---|---|---|
| BA | 47 | 23 | Não | Sim | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| CE | 68 | 25 | Sim | Não | Sim | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| RO | 52 | 11 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| AC | 49 | 25 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| AP | 49 | 25 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| DF | 50 | 20 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| ES | 58 | 21 | Sim | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| MG | 49 | 25 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| MS | 48 | 27 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| MT | 45 | 17 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| PB | 47 | 25 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| PE | 47 | 24 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| PR | 64 | 22 | Sim | Não | Sim | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| RJ | 70 | 25 | Sim | Não | Sim | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| RN | 47 | 30 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42267723718 |
| RR | 49 | 25 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42281730173 (lote 4 isolado) |
| RS | 54 | 24 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42281730173 |
| SC | 47 | 20 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42281730173 |
| SP | 50 | 26 | Não | Não | Não | Sim | Sim | LIVE_READONLY_PASSED | 42281730173 |
| MA | 68 | 25 | Sim | Não | Sim | Sim | Não | **MA_TO_LIVE_PENDING** | Nenhum live após PR #11 |
| TO | 48 | 16 | Não | Não | Não | Sim | Não | **MA_TO_LIVE_PENDING** | Nenhum live após PR #11 |
| SE | 1 | 1 | Não | Não | Não | Skip | — | NOT_APPLICABLE | GATE3 sem formulário |

Implementado: **21**. Mocked estrutural local Etapa 14: **21/21**. Live comprovado: **19** (15 + lote 4). Live MA/TO: **não executado**. Live 21/21: **não declarar**.

Último live na `main`: [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) (`workflow_dispatch`, lote 4 RR/RS/SC/SP). Runs posteriores ao PR #11 são mocked de PR (#12), não live de MA/TO.

## Cobertura declarada vs exercitada

| Camada | O que o teste realmente observa |
|---|---|
| Inventário | Labels/ids versionados |
| Mocked | `/form/*` via `uiFormMock` + seções renderizáveis + casca mapeada com `*` + TG + Credor + linha de veículo |
| Live | Headings do perfil + todos os `*` visuais + TG + credor/documentos + linha de veículo + extras CE/MA/RO |
| Não exercitado mocked | Documentos; `agenteFinanceiroCadastro`; campos sem `CAMPO_POR_ID` |

## Impacto / recomendação / status / limitação

Impacto: MA/TO continuam sem evidência live.  
Recomendação: após rotação da senha Master, disparar `ufs=MA,TO` na `main` — não neste PR.  
Status: `MA_TO_LIVE_PENDING`.  
Limitação: live lote 4 foi isolado; o acumulado 19 não rodou num único job.
