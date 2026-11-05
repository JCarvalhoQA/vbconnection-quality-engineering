# CE / RO — live × Java × mock × POM

**Status:** COMPARADO  
**Data:** 2026-11-05  
**Java/fixture:** `fixtures/matriz/CE.json` e `RO.json` (não alteradas)  
**Mock:** `mockContratoCadastroApis` lê a fixture; combo mockado **não** lista CE/RO  
**POM:** `contratoPage.ts` — não alterado  
**Ação recomendada:** só documentada, não executada

Classificação: CONFIRMADA_LIVE · CONFIRMADA_JAVA · CONFIRMADA_MOCK · PENDENTE · INCOMPATÍVEL

## Suíte / combo

| Tema | Live | Java | Mock / Playwright | Impacto | Ação (não fazer agora) |
|---|---|---|---|---|---|
| CE no destinos-combo | id 236 ATIVO | coluna + fixture | fora de `DetranUf`; `naSuitePlaywright: false` | specs atuais não cobrem CE real | decisão de produto: inspecionar ok; **não** incluir suíte |
| RO no destinos-combo | id 234 ATIVO | coluna + fixture | idem | idem | idem |
| Combo mock 19 UFs | 22 live | 20 colunas | INCOMPATÍVEL conjunto | falso verde de destino | não homogeneizar mock nesta gate |

## Veículo

| Campo | Live CE | Live RO | Java CE | Java RO | POM | Classe | Ação |
|---|---|---|---|---|---|---|---|
| UI linha vs dialog | inline | inline | n/a | n/a | assume placeholder Chassi (ok) mas não dialog | CONFIRMADA_LIVE | alinhar POM ao inline **depois** de decisão; não nesta gate |
| Cancelar | ausente | ausente | n/a | n/a | não tem Cancelar explícito | CONFIRMADA_LIVE | usar Excluir em live-readonly |
| `veiculoZeroKm` | default Sim | default Sim | **ausente** | **ausente** | **não trata** placa/UF/RENAVAM | INCOMPATÍVEL Java/POM | SoT = Nova UX; fixture não modela |
| Placa/UF/RENAVAM | condicional | condicional | sempre visível opcional | sempre visível opcional | não preenche | INCOMPATÍVEL apresentação | não fill placa com zero km Sim |
| `INDICA_NOVO_USADO` | ausente | ausente | `[false,false]` | `[false,false]` | só preenche se visível | CONFIRMADA_LIVE + JAVA | não criar cenário usado CE/RO |
| Ano fabricação | **`*`** | opcional | `[true,false]` | `[true,false]` | preenche se visível | INCOMPATÍVEL CE (`*` vs Java opcional) | produto: Angular força CE? |
| Situação chassi | sim | não | `REMARCADO` visível CE / oculto RO | oculto RO | preenche se REMARCADO | CONFIRMADA_LIVE + JAVA | ok se gated na matriz |
| Marca/modelo, espécie | sim | não | visíveis CE | ocultos RO | fill condicional incompleto | CONFIRMADA_LIVE | não exigir na RO |
| Número motor | ausente | ausente | oculto | oculto | — | alinhado | — |
| IDs dinâmicos | sim | sim | n/a | n/a | placeholder Chassi ainda funciona | CONFIRMADA_LIVE | não usar `#chassi` |

## Contrato / agente / pessoas

| Campo | Live CE | Live RO | Java | POM | Classe | Ação |
|---|---|---|---|---|---|---|
| Tipo de Contrato | opcional | opcional | `[true,false]` ambos | asserts frágeis se copiar SP/BA | CONFIRMADA_LIVE + JAVA | não exigir na BA; exigir presença (não `*`) em CE/RO |
| Taxa juros mês | `*` CE | opcional RO | CE `[true,true]`; RO `[true,false]` | — | alinhado | massa distinta |
| Data/época/local pagamento | `*` CE | ausente RO | CE vis+obr; RO oculto | POM DF usa `#dataPagamento` | alinhado CE/RO; BA ausente | locators por UF |
| Índice | opcional | opcional | `[true,false]` | BA live era `*` | INCOMPATÍVEL BA vs Java; CE/RO alinhados | não copiar `*` da BA |
| Código DETRAN agente | opcional | opcional | `[true,false]` | — | alinhado; BA Java oculto | — |
| Celular devedor | `*` CE | ausente | CE CEL obr; RO CEL oculto | POM não preenche telefone | CONFIRMADA_LIVE + JAVA | massa CE precisa celular |
| Credor `*` | nenhum | nenhum | CE todos opcionais; RO UF/cidade **obrigatórios** | POM não preenche credor | INCOMPATÍVEL RO | produto: live Master pré-preenche vs Java |
| E-mail contrato | ausente CE | presente RO | CE `EMAIL_CONTRATO` oculto; RO não tem chave explícita igual BA extra | — | CE alinhado; RO extra PENDENTE mapeamento | — |
| Valor TAC | ausente | presente | CE oculto; RO `[true,false]` | — | alinhado | — |
| TG | 12 opcionais | ausente | CE seção true; RO false | heading se secao visível | alinhado existência; EMAIL TG Java vs live INCOMPATÍVEL | ver TG.md |
| Documentos | dropzone | dropzone | não modelado | não cobre upload | CONFIRMADA_LIVE | não upload |

## Origem da evidência × impacto

| Achado | Origem | Impacto automação | Recomendação |
|---|---|---|---|
| CE/RO form carrega no newfront | CONFIRMADA_LIVE | destinos reais existem | **não** incluir na suíte ainda |
| Mock sem CE/RO no combo | CONFIRMADA_MOCK | specs 19 não exercitam essas UFs | manter fora |
| Zero km em todas as 3 | CONFIRMADA_LIVE | POM/matriz cegos | Gate de POM futuro |
| Novo/usado só BA | LIVE + JAVA | 40 cenários “usado” continuam inválidos | só BA |
| Ano fabricação `*` só CE | LIVE vs JAVA opcional | fill opcional pode passar; assert `*` falha se baseado em Java | decisão produto |
| TG CE opcional | LIVE + JAVA | Registrar com TG vazio = BLOQUEADO | não persistir para descobrir |
| Credor RO Java obr vs live opt | INCOMPATÍVEL | oráculo Java mente no `*` | não assertar `*` credor live |

Fixtures e mocks **não** foram editados.
