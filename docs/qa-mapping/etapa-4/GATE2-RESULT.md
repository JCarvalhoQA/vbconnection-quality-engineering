# Gate 2 — Resultado da auditoria comparativa BA × CE × RO

**Status:** CONCLUÍDO (somente leitura)  
**Data:** 2026-11-05  
**Alvo:** `https://newfront.vbconnection.info/vbconnection/contrato/inserir`  
**Perfil:** MASTER (confirmado em cada sessão)  
**Modo:** live-readonly · persistGuard antes da navegação  
**Persistência:** `abortados: []` em CE e RO · nenhum Salvar / Registrar / upload

Inspeção por UF em sessões separadas. Combo Destino **não** reaberto após a seleção.

## Achados

| # | Achado | CE | RO | BA (Gate 1) |
|---|---|---|---|---|
| 1 | Formulário PAGE-02 carrega | sim | sim | sim |
| 2 | Veículo = linha inline, sem modal | sim | sim | sim |
| 3 | `indicaNovoUsado` | **ausente** | **ausente** | obrigatório |
| 4 | `veiculoZeroKm` default Sim | sim | sim | sim |
| 5 | UF placa / Placa / RENAVAM se zero km = Não | sim | sim | sim |
| 6 | Terceiro garantidor | **visível, todos opcionais** | **ausente** | ausente |
| 7 | Documentos (dropzone) | presente | presente | presente |
| 8 | Credor | presente, sem `*` | presente, sem `*` | presente, sem `*` |
| 9 | Campos na casca | 68 (25 `*`) | 52 (11 `*`) | 47 (23 `*`) |
| 10 | CE/RO na suíte Playwright | não | não | sim |

## Números

| Métrica | CE | RO |
|---|---|---|
| id destinos-combo | 236 | 234 |
| Campos casca | 68 | 52 |
| Obrigatórios visuais | 25 | 11 |
| Campos linha veículo (zero km Sim) | 8 | 5 |
| Campos linha veículo (zero km Não) | 11 | 8 |
| TG | 12 campos, 0 `*` | 0 |
| Specs de regressão adicionados | 0 | 0 |

## Entregáveis

| Arquivo | Conteúdo |
|---|---|---|
| [CE-FIELD-INVENTORY.md](./CE-FIELD-INVENTORY.md) | Inventário CE |
| [RO-FIELD-INVENTORY.md](./RO-FIELD-INVENTORY.md) | Inventário RO |
| [CE-LOCATORS.md](./CE-LOCATORS.md) | Locators CE |
| [RO-LOCATORS.md](./RO-LOCATORS.md) | Locators RO |
| [BA-CE-RO-COMPARISON.md](./BA-CE-RO-COMPARISON.md) | Matriz das três UFs |
| [THIRD-PARTY-GUARANTOR.md](./THIRD-PARTY-GUARANTOR.md) | TG (prioridade CE) |
| [LIVE-VS-JAVA-VS-MOCK.md](./LIVE-VS-JAVA-VS-MOCK.md) | Java / fixture / POM |
| [PRODUCT-DECISIONS.md](./PRODUCT-DECISIONS.md) | Decisões para a automação |

Dumps: `docs/qa-mapping/evidence/live/gate2-ce-*.json` e `gate2-ro-*.json` (gitignored).

## Recusado de propósito

- Incluir CE/RO em `DetranUf` / specs de registro
- Alterar POM, fixtures, mocks, matriz Java
- PAGE-03..08, persistência, commits
- Preenchimento de TG / CEP (GET ViaCEP não disparado)
