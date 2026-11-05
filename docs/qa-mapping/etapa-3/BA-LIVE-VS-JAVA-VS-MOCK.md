# Bahia — Nova UX live × matriz Java × mock

**Status:** COMPARADO CAMPO A CAMPO  
**Data:** 2026-11-05  
**Live:** Gate 1 newfront (PAGE-02 BA + linha de veículo)  
**Java:** `auto.ui/playwright/fixtures/matriz/BA.json` ← `MatrizDados*.java` (não alterada)  
**Mock:** `mockContratoCadastroApis` lê a fixture Java; `uf === 'SE'` lança indisponível; CE/RO fora do combo mockado

Classificação pedida:

| Código | Significado |
|---|---|
| CONFIRMADA_LIVE | visto no newfront nesta gate |
| CONFIRMADA_JAVA | definido na matriz/enum |
| CONFIRMADA_MOCK | comportamento do mock/fixture |
| PENDENTE | evidência incompleta |
| INCOMPATÍVEL | duas fontes se contradizem |

Nenhuma célula abaixo autoriza patch automático em Java ou mock.

## Seções

| Seção | Live PAGE-02 | Java `secoes` | Mock | Classificação |
|---|---|---|---|---|
| Agente financeiro | sim | `DADOS_AGENTE_FINANCEIRO: true` | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Veículos | sim | `DADOS_VEICULO: true` | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Contrato | sim | `DADOS_CONTRATO: true` | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Devedor | sim | `DADOS_DEVEDOR: true` | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Credor | sim | `DADOS_CREDOR: true` | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Complementares | sim | `DADOS_COMPLEMENTARES: true` | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Terceiro garantidor | **não** | `false` | replica false | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Aditivo | **não nesta página** | `DADOS_ADITIVO: true` | mock responde se chamado | INCOMPATÍVEL (página vs flag) |
| Documentos | heading sim | não modelado | não modelado | CONFIRMADA_LIVE; Java/mock ausentes |
| Destino | sim | fora de `secoes` | combo mock ≠ 22 UFs live | CONFIRMADA_LIVE; mock INCOMPATÍVEL no conjunto de UFs |

## Campos alinhados (visibilidade + obrigatoriedade visual)

| Campo Java | Live | Mock (fixture) | Classificação |
|---|---|---|---|
| `TIPO_RESTRICAO` vis+obr | Tipo de restrição* | `[true, true]` | CONFIRMADA_LIVE + CONFIRMADA_JAVA + CONFIRMADA_MOCK |
| `NUMERO` vis+obr | Número do Contrato* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `DATA_CONTRATO` vis+obr | Data do contrato* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `DATA_LIBERACAO_CREDITO` vis+obr | Liberação de crédito* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `NUMERO_PARCELAS` vis+obr | Número de parcelas* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `VENCIMENTO_PRIMEIRA_PARCELA` vis+obr | Venc. 1ª parcela* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `VENCIMENTO_ULTIMA_PARCELA` vis+obr | Venc. última parcela* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `VALOR_TOTAL` vis+obr | Valor total financiamento* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `UF_LIBERACAO_CREDITO` vis+obr | UF liberação crédito* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `MUNICIPIO_LIBERACAO_CREDITO` vis+obr | Cidade liberação crédito* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `TIPO_CONTRATO` oculto | ausente | `[false, false]` | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `INDICE_SIGLA` vis+obr | Índice* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `NUMERO_CHASSI` vis+obr | Chassi* (linha) | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `NUMERO_RESTRICAO` vis+obr | N° gravame* | idem | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `INDICA_NOVO_USADO` vis+obr **só BA** | Novo / usado* | `[true, true]` só BA | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `NUMERO_MOTOR` vis opcional | Número motor | `[true, false]` | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| `ANO_FABRICACAO` / `ANO_MODELO` ocultos | ausentes | `[false, false]` | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Devedor doc/nome/endereço/telefone vis+obr | correspondem (telefone único) | replica Java | CONFIRMADA_LIVE (shape) + CONFIRMADA_JAVA |
| Agente documento vis+obr; nome vis opcional | CNPJ* disabled; Nome disabled | replica | CONFIRMADA_LIVE + CONFIRMADA_JAVA |

## Campos ausentes no live (existem na Java como visíveis)

| Campo Java | Java | Live | Mock | Classificação |
|---|---|---|---|---|
| `FUNDO_RESERVA_PREV` | `[true, false]` | ausente | replica Java | INCOMPATÍVEL live×Java |
| Credor `END_*` e `TEL_*` obrigatórios | `[true, true]` | visíveis **sem** `*` | replica Java | INCOMPATÍVEL obrigatoriedade visual; PENDENTE funcional |
| `PLACA` / `PLACA_UF` / `RENAVAM` sempre visíveis | `[true, false]` | só com zero km = Não | replica Java (sempre visível no GET form) | INCOMPATÍVEL de apresentação; regra extra no front |

## Campos adicionais no live (não estão na matriz)

| Campo live | Java | Mock | Classificação |
|---|---|---|---|
| Veículo zero km? (`veiculoZeroKm`) | ausente | não há chave | CONFIRMADA_LIVE; Java/mock ausentes |
| E-mail do contrato (`emailContrato`) | ausente em `DADOS_CONTRATO` | ausente | CONFIRMADA_LIVE |
| Seção Documentos | ausente | ausente | CONFIRMADA_LIVE |
| Taxa contrato (`taxaContrato`) | possível `VALOR_TAC` oculto `[false, false]` | replica oculto | PENDENTE mapeamento; CONFIRMADA_LIVE existência |
| Combobox Destino / Alterar destino | fora da matriz de campos | combo mock 19 UFs | CONFIRMADA_LIVE; mock INCOMPATÍVEL (22 vs 19) |

## Campos ocultos Java confirmados ausentes no live

`CODIGO_DETRAN` agente; `LISTA_VEICULOS`, `MARCA`, `MARCA_BEM`, `MODELO_BEM`, `VERSAO_MODELO_BEM`, `TIPO_CATEGORIA_VEICULO`, `TIPO_COMBUSTIVEL_BEM`, `TIPO_ESPECIE`, `DESCRICAO_COR_VEICULO`, `REMARCADO`, `UF_LICENCIAMENTO`; bloco grande de datas de contrato (`DATA_PAGAMENTO`, `DATA_BAIXA`, …); `CEL_*` e `EMAIL` devedor/credor; TG inteiro; `CORRECAO_MONETARIA`, `MORA_VALOR`, `MULTA_VALOR`, `NUMERO_CND`, `OPCAO_COMPRA`.

Classificação: CONFIRMADA_LIVE + CONFIRMADA_JAVA (alinhados na ausência).

## Condicionais e regras específicas BA

| Regra | Live | Java | Mock | Classificação |
|---|---|---|---|---|
| `INDICA_NOVO_USADO` obrigatório só BA | obrigatório na BA | `[true, true]` BA; `[false, false]` demais colunas | fixture por UF | CONFIRMADA_LIVE (BA) + CONFIRMADA_JAVA |
| Novo vs Usado muda campos | **não** | não modela | não modela | CONFIRMADA_LIVE |
| Zero km controla placa/UF/RENAVAM | **sim** | não modela zero km | não modela | CONFIRMADA_LIVE; Java INCOMPATÍVEL (não expressa a regra) |
| Telefone = DDD + número | um campo máscara | dois campos Java | dois campos no GET form | INCOMPATÍVEL shape |
| Credor pré-preenchido Master | sim | não descreve sessão | mock pode omitir | CONFIRMADA_LIVE; PENDENTE se o mock cobre |
| `DADOS_ADITIVO: true` na PAGE-02 | não | true | GET aditivo se chamado | INCOMPATÍVEL de tela |

## Obrigatoriedade — resumo

| Grupo | Live visual | Java | Veredito |
|---|---|---|---|
| 23 `*` da casca | Gate 1 = Gate 0 | maioria alinhada | CONFIRMADA_LIVE |
| Credor | 0 `*` | vários `[true, true]` | INCOMPATÍVEL |
| Zero km / placa | 0 `*` nos extras | placa opcional sempre visível | INCOMPATÍVEL apresentação; PENDENTE validator Angular vs `*` |
| `veiculoZeroKm` | sem `*` | — | CONFIRMADA_LIVE; Angular `Validators.required` = PENDENTE vs label |

## Mock — o que ele ainda não prova

| Tema | Mock hoje | Live | Classificação |
|---|---|---|---|
| 22 UFs do destinos-combo | 19 (`DetranUf`, com SE sintético 27, sem CE/RO/MA) | 22 ATIVO | INCOMPATÍVEL |
| Formulário SE | `MatrizIndisponivelError` | combo tem DETRAN-SE id 229 | CONFIRMADA_MOCK skip; live form **não** inspecionado |
| Paridade de labels/máscaras | GET form Java | Nova UX | mock não finge Nova UX |
| Zero km / inline table / Excluir | POM antigo (dialog, Cancelar, situação chassi) | outro contrato de UI | INCOMPATÍVEL até Gate de POM (não nesta autorização) |

## O que não foi alterado

- `MatrizDados*.java`
- `fixtures/matriz/*.json`
- `contratoCadastroMocks.ts`
- Page Objects
