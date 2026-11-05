# Gate 0 — Locators PAGE-02 Bahia (live)

**Status:** CASCA VALIDADA · modal veículo NÃO validado  
**Data:** 2026-11-05  
**Fonte:** asserts Playwright + `page02-ba-locators.json` + inventory  
**Confiança:** CONFIRMADO_TESTE para a casca; NÃO OBSERVADO para o modal de veículo

## Validados por assert/interação (5)

| Locator | Resultado |
|---|---|
| heading `Registrar contrato` | visível |
| combobox `Destino` | visível; selecionou `DETRAN-BA` |
| heading `Agente financeiro` | visível após BA |
| heading `Veículos` | visível após BA |
| botão `Registrar contrato` | habilitado após BA; **não clicado** |

O assert `botaoRegistrar` **antes** de escolher o destino veio `false` — o botão entra no fluxo depois da config do DETRAN.

## Identificados no DOM, sem clique (47)

Padrão estável observado:

- Preferir `getByRole` + label (`Destino`, `Agente financeiro`, `Número do Contrato`, …)
- Há `id` nativo em vários inputs (`numeroContrato`, `dataContrato`, `devedorCnpj`, …)
- `formcontrolname` existe (`destino`, `agenteFinanceiro`, `numero`, …)
- **Colisão:** `formControl` `uf`, `cidade`, `numero`, `cep`, `nome` se repetem em agente/devedor/credor — não usar sozinhos

## POM atual vs live

O POM (`contratoPage.ts`) já usa heading + combobox Destino + `selectOption` `DETRAN-BA`. Isso funcionou live.

Não validado nesta inspeção (não abrir modal / não alterar PO):

- placeholder Chassi
- combobox Situação do chassi
- Novo/Usado (`INDICA_NOVO_USADO`)
- `nz-date-picker#dataPagamento` (DF; BA não mostrou Data de pagamento neste inventário)

## Risco

Header do POM de logout busca `/administrador/i`. Live Master mostra rótulo **master**. Logout Master quebraria esse locator — fora do Gate 0.
