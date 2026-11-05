# Gate 0 — Nova UX live × matriz Java (BA)

**Status:** COMPARAÇÃO PARCIAL (casca PAGE-02 BA; sem modal de veículo)  
**Data:** 2026-11-05  
**Live:** `page02-ba-inventory.json`  
**Java:** `fixtures/matriz/BA.json` ← `matriz-form.json`  
**Confiança:** CONFIRMADO_TESTE só onde o DOM foi visto; Java permanece CONFIRMADO_CODIGO

## Alinhados (BA)

| Tema | Live | Java | Confiança |
|---|---|---|---|
| Tipo de Contrato ausente na PAGE-02 | não aparece no inventário | `TIPO_CONTRATO` oculto | CONFIRMADO_TESTE |
| Tipo de restrição obrigatório | `Tipo de restrição*` `nz-select#tipoGravame` | `TIPO_RESTRICAO` visível+obrigatório | CONFIRMADO_TESTE |
| Data do contrato obrigatória | `Data do contrato*` date-picker | `DATA_CONTRATO` visível+obrigatório | CONFIRMADO_TESTE |
| Índice obrigatório | `Índice*` | `INDICE_SIGLA` visível+obrigatório | CONFIRMADO_TESTE |
| Seção TG | sem heading | `DADOS_TERCEIRO_GARANTIDOR: false` | CONFIRMADO_TESTE |
| Seções Agente / Veículos / Contrato / Devedor / Credor / Complementares | headings visíveis | `secoes.*: true` | CONFIRMADO_TESTE |
| Id DETRAN-BA | 14 | `idHmg: 14` | CONFIRMADO |

## Não observados live (não inferir)

| Tema | Java | Live | Nota |
|---|---|---|---|
| `INDICA_NOVO_USADO` obrigatório | visível+obrigatório | modal veículo não aberto | NÃO OBSERVADO |
| `ANO_FABRICACAO` oculto | oculto | idem | NÃO OBSERVADO |
| Chassi / gravame no modal | vários | tabela “Nenhum veículo” | NÃO OBSERVADO |

## Divergências / extras da Nova UX

| Tema | Detalhe | Confiança |
|---|---|---|
| Heading **Documentos** na PAGE-02 | Java não modela isso em `MatrizDados*` de contrato | CONFIRMADO_TESTE |
| `DADOS_ADITIVO: true` na fixture BA | PAGE-02 live **não** mostra seção Aditivo (página distinta) | CONFIRMADO_TESTE |
| Combo live tem **MA** e **SE** | Java sem MA; SE sem coluna na matriz | CONFIRMADO |
| Combo live tem **CE** e **RO** | Java tem; suíte Playwright ainda fora | CONFIRMADO |

Não promover o mock homogêneo antigo nem fills do POM como paridade live. O mock continua espelhando Java (0 mismatches); a Nova UX live é outra SoT.
