# Auditoria técnica — Etapa 16

**HEAD da `main`:** `7edfed2ee2f3d297075e3c0a0fd2afad86f0ba79` (merge do [PR #16](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/pull/16)).
**Data:** 2026-11-10.
**Escopo:** negativos canônicos `positivo_negativo=negativo` e `automacao=Apenas mapeado`. Sem live. Sem registro persistente.

## Fonte

CSV `docs/qa-mapping/scenario-inventory/SCENARIO-INVENTORY.csv` (UTF-8 BOM, 83 linhas). Os 17 IDs **não** foram inventados.

## Recorte do inventário (início da etapa)

| Classificação | Qtd |
|---|---:|
| Automatizado | 40 |
| Parcialmente automatizado | 4 |
| Apenas mapeado | 32 |
| Bloqueado | 4 |
| Não aplicável | 3 |
| **Total** | **83** |

Negativos: 7 automatizados + 1 bloqueado (CT-016) + **17 apenas mapeados** = 25.

## Automação existente reutilizada

| Peça | Uso nesta etapa |
|---|---|
| `ContratoActions` / `ContratoPage` / `VeiculoSection` | Preenchimento PAGE-02; sem POM paralelo |
| `mockContratoCadastroApis` + `persistGuard` | Mock + abort de persistência real |
| `fillNzDatePicker` / `fillNamed` | SoT de Tab vs Enter no datepicker |
| Toast `Contrato registrado com sucesso.` | Copy **confirmada** do happy path (CT-047) |
| Matriz Java `[visível, obrigatório]` | Sem tamanho de chassi, sem regex de CPF |
| PAGE-03…08 | Sem POM Nova UX; locators v2 **não** são SoT NX |

## O que a Java **não** confirma

`NUMERO_CHASSI` em `fixtures/matriz/*.json` é só `[visível, obrigatório]`. Não há maxlength 17. A factory feliz gera 17 caracteres — isso **não** é regra de UI.

Inspeção live BA (`docs/qa-mapping/etapa-3/BA-VEICULO-MODAL.md`): chassi `A` + Tab **não** exibe span de padrão I/O/Q.

## Segurança

`BLOCKED_SECURITY_CREDENTIAL_ROTATION` permanece. Novos testes: só `@mocked`. `persistGuard` intacto. Live não disparado. Environment / workers=1 / retries=0 / fullyParallel off no live **não** foram alterados.
