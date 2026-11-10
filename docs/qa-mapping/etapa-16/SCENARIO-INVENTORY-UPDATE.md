# Atualização do inventário — Etapa 16

IDs canônicos **CT-001–CT-083** preservados. Nenhum ID novo.

## Movimentação

| ID | Antes | Depois | Evidência |
|---|---|---|---|
| CT-052 | Apenas mapeado | Automatizado / Mocked | `contrato-negativos.spec.ts` MOCKED_PASSED |
| CT-053 | Apenas mapeado | Automatizado / Mocked | `api-negativos.spec.ts` MOCKED_PASSED |

## Totais

| Status | Antes | Depois |
|---|---:|---:|
| Automatizado | 40 | **42** |
| Parcialmente | 4 | 4 |
| Apenas mapeado | 32 | **30** |
| Bloqueado | 4 | 4 |
| Não aplicável | 3 | 3 |
| **Total** | **83** | **83** |

Negativos: 9 automatizados + 1 bloqueado + 15 mapeados = 25.

## Candidatos futuros (não viram CT-084+)

- Mensagem de data inválida (recorte que CT-052 **não** cobre).
- Copy HTTP 5xx na PAGE-02.
- POM NX de PAGE-03…08 para CT-064/070/077/080–082.
- Confirmação de chassi ≠ 17 e CPF na Nova UX.
