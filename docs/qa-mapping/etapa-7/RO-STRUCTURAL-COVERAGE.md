# Cobertura estrutural PAGE-02 — RO

**Fonte visual:** `LIVE-FIELD-INVENTORY.json` (Gate 2).  
**Não** usa a matriz Java para sobrescrever a UI.  
**Não** entra em `DetranUf` / suíte de registro.

## Specs

| Modo | Arquivo | Status local |
|---|---|---|
| `@mocked` | `e2e/contratos/page02/ro-estrutural.spec.ts` | passed 7,4s |
| `@live-readonly` | mesmo arquivo, gated | listado; **não executado na CI desta etapa** |

Destino: `DETRAN-RO` · id combo **234**.

## O que o teste cobre

Comum: autenticação · PAGE-02 · destino RO · linha de veículo · Chassi/Gravame · Zero km condicional · descarte sem persistir.

Específico RO (live / inventário):

- **Ausência** da seção Terceiro Garantidor.
- **Ausência** de Novo/usado.
- Data do contrato, parcelas e valor total **visíveis sem** `*` visual.
- Credor e Documentos presentes.
- 11 obrigatórios visuais da casca (via inventário no describe live).

Mocked: casca mínima + TG ausente + veículo + descarte.

## Homologação funcional

**Não.** Inspeção estrutural apenas.
