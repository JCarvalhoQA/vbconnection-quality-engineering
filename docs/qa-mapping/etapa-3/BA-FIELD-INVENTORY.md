# Bahia — inventário de campos PAGE-02

**Status:** REVISADO GATE 1  
**Data:** 2026-11-05  
**Fonte live:** `gate1-page02-inventory.json` (casca, 47 campos) + dumps do formulário de veículo  
**Java:** `fixtures/matriz/BA.json`  
**Confiança padrão:** CONFIRMADA_LIVE para rótulo/tipo/`formcontrolname`/obrigatoriedade visual. Obrigatoriedade funcional só onde houve blur seguro.

Critérios:

- Locator preferencial: `getByRole` / `getByLabel` **dentro da seção**.
- `formcontrolname` repetido (`uf`, `cidade`, `numero`, `cep`, `nome`, `cnpj`) **nunca** sozinho.
- IDs de veículo são dinâmicos — ver [BA-LOCATORS.md](./BA-LOCATORS.md).
- Valores de Credor / Agente / sessão **não** são copiados (PII / dados de ambiente).

## Seções (headings)

Registrar contrato · Destino · Agente financeiro · Veículos · Contrato · Devedor · Credor · Dados complementares · Documentos

Ausentes nesta página: Terceiro garantidor, Aditivo.

## Destino (1)

| Nome | Tipo | `formcontrolname` | id | Obrig. visual | Obrig. funcional | Dependências | Máscara | Validação | Confiança |
|---|---|---|---|---|---|---|---|---|---|
| Destino | `nz-select` | `destino` | `destino` | sim | sim (form não carrega sem) | após selecionar: **disabled**; troca via **Alterar destino** | — | `*` | CONFIRMADA_LIVE |

Combo live (22 UFs) documentado em [LIVE-UF-STATUS.md](./LIVE-UF-STATUS.md). Recaptura do overlay após BA **não** foi feita: o controle já está desabilitado.

## Agente financeiro (3)

| Nome | Tipo | `formcontrolname` | id | Obrig. visual | Disabled | Dependências | Confiança |
|---|---|---|---|---|---|---|---|
| Agente financeiro | `nz-select` | `agenteFinanceiro` | `agenteFinanceiroCadastro` | sim | não | preenche CNPJ/Nome | CONFIRMADA_LIVE |
| CNPJ | `input` | `cnpj` | `cnpjAgenteFinanceiro` | sim | **sim** (derivado) | agente | CONFIRMADA_LIVE |
| Nome | `input` | `nome` | `nomeAgenteFinanceiro` | não | **sim** | agente | CONFIRMADA_LIVE |

Opções do combo (CNPJ redigido): AYMORE CRED FINANC E INVEST SA; BANCO HONDA S.A; BANCO PAN; Banco Piloto; OMNI S A FINC INVEST; Panamericano arrendamento mercantil S.A; TESTE 1; Teste RO; UNIBANCO LEASING S A ARREND MERCANTIL; teste 3; teste 4.

Java: `NOME` visível opcional; `NUMERO_DOCUMENTO` visível obrigatório; `CODIGO_DETRAN` oculto — alinhado.

## Veículos (casca + linha)

Casca: heading, tabela “Nenhum veículo”, botão Adicionar veículo. Nenhum input na casca (os 47 **não** incluem veículo).

Com linha aberta — ver [BA-VEICULO-MODAL.md](./BA-VEICULO-MODAL.md).

| Nome | `formcontrolname` | Obrig. visual | Condicional | Java BA `[vis, obr]` |
|---|---|---|---|---|
| Chassi | `chassi` | sim | sempre na linha | `NUMERO_CHASSI` `[true, true]` |
| N° gravame/restrição | `restricao` | sim | sempre | `NUMERO_RESTRICAO` `[true, true]` |
| Veículo zero km? | `veiculoZeroKm` | não | extra Nova UX; default Sim | **ausente na matriz** |
| Novo / usado | `indicaNovoUsado` | sim | sempre na BA | `INDICA_NOVO_USADO` `[true, true]` |
| Número motor | `numeroMotor` | não | sempre | `NUMERO_MOTOR` `[true, false]` |
| UF da placa | `uf` | não | só se zero km = Não | `PLACA_UF` `[true, false]` |
| Placa | `placa` | não | só se zero km = Não | `PLACA` `[true, false]` |
| RENAVAM | `renavam` | não | só se zero km = Não | `RENAVAM` `[true, false]` |

## Contrato (18)

| Nome | Tipo | `formcontrolname` | id | Obrig. visual | Placeholder / máscara | Java |
|---|---|---|---|---|---|---|
| Tipo de restrição | `nz-select` | `tipoGravame` | `tipoGravame` | sim | Arrendamento mercantil, Reserva domínio, Alienação fiduciária, Penhor | `TIPO_RESTRICAO` `[true, true]` |
| Número do Contrato | `input` | `numero` | `numeroContrato` | sim | “Número do Contrato” | `NUMERO` `[true, true]` |
| Número de registro | `input` | `registro` | `registroContrato` | não | — | `NUMERO_REGISTRO` `[true, false]` |
| Data do contrato | `nz-date-picker` | `dataContrato` | `dataContrato` | sim | `dd/mm/aaaa` | `DATA_CONTRATO` `[true, true]` |
| Liberação de crédito | `nz-date-picker` | `liberacaoCredito` | `liberacaoCredito` | sim | `dd/mm/aaaa` | `DATA_LIBERACAO_CREDITO` `[true, true]` |
| Número de parcelas | `input` | `parcelas` | `parcelas` | sim | — | `NUMERO_PARCELAS` `[true, true]` |
| Valor da parcela | `input` | `parcela` | `parcela` | não | — | `VALOR_PARCELA` `[true, false]` |
| Venc. 1ª parcela | `nz-date-picker` | `primeiraParcela` | `primeiraParcela` | sim | `dd/mm/aaaa` | `VENCIMENTO_PRIMEIRA_PARCELA` `[true, true]` |
| Venc. última parcela | `nz-date-picker` | `ultimaParcela` | `ultimaParcela` | sim | `dd/mm/aaaa` | `VENCIMENTO_ULTIMA_PARCELA` `[true, true]` |
| IOF | `input` | `iof` | `iof` | não | — | `IOF_VALOR` `[true, false]` |
| Valor total financiamento | `input` | `totalFinanciamento` | `totalFinanciamento` | sim | “Valor total” | `VALOR_TOTAL` `[true, true]` |
| Comissão | `input` | `comissao` | `comissao` | não | — | `COMISSAO_VALOR` `[true, false]` |
| Penalidade | `input` | `penalidade` | `penalidade` | não | — | `PENALIDADE_DESCRICAO` `[true, false]` |
| Taxa juros mês (%) | `input` | `taxaJurosMes` | `taxaJurosMes` | não | `0,00` | `JUROS_TAXA_MENSAL` `[true, false]` |
| Taxa juros ano (%) | `input` | `taxaJurosAno` | `taxaJurosAno` | não | `0,00` | `JUROS_TAXA_ANUAL` `[true, false]` |
| UF liberação crédito | `nz-select` | `uf` | `ufLiberacaoCredito` | sim | cidade depende desta UF | `UF_LIBERACAO_CREDITO` `[true, true]` |
| Cidade liberação crédito | `nz-select` | `cidade` | `cidadeLiberacaoCredito` | sim | depende da UF | `MUNICIPIO_LIBERACAO_CREDITO` `[true, true]` |
| E-mail do contrato | `input` email | `email` | `emailContrato` | não | “E-mail” | **ausente** na matriz de contrato |

`TIPO_CONTRATO`: Java BA oculto; **não** aparece live.

Blur seguro: Número do Contrato vazio + Tab. O dump estruturado replica `*` visual dos obrigatórios; o texto “Campo obrigatório” não foi serializado à parte — PENDENTE para o copy exato.

## Devedor (10)

| Nome | Tipo | `formcontrolname` | id | Obrig. visual | Máscara / tamanho | Dependências |
|---|---|---|---|---|---|---|
| CPF / CNPJ | `input` | `cnpj` | `devedorCnpj` | sim | placeholder “CPF / CNPJ” | — |
| Nome completo | `input` | `nome` | `devedorNome` | sim | **maxlength 40** | — |
| CEP | `input` | `cep` | `devedorCep` | sim | `00000-000` | esperado preencher logradouro (não exercitado: evitaria GET de CEP se mutasse) |
| Logradouro | `input` | `logradouro` | `devedorLogradouro` | sim | — | CEP |
| Número | `input` | `numero` | `devedorNumero` | sim | colisão `numero` | — |
| Complemento | `input` | `complemento` | `devedorComplemento` | não | — | — |
| Bairro | `input` | `bairro` | `devedorBairro` | sim | — | — |
| UF | `nz-select` | `uf` | `devedorUf` | sim | — | habilita Cidade |
| Cidade | `nz-select` | `cidade` | `devedorCidade` | sim | **disabled** até UF | UF |
| Telefone | `input` | `numero` | `devedorTelefone` | sim | `(00) 00000-0000` | colisão grave: `formcontrolname=numero` igual ao número de endereço |

Java: `TEL_DDD`+`TEL_NUMERO` obrigatórios (dois campos); live é **um** telefone. `CEL_*` e `EMAIL` ocultos na Java — não aparecem.

## Credor (8)

Campos presentes, **sem** `*` visual. Java marca endereço e telefone como visível+obrigatório. Sessão Master pré-preenche (valores não documentados).

| Nome | id | `formcontrolname` | Obrig. visual | Obrig. funcional | Confiança |
|---|---|---|---|---|---|
| CEP | `credorCep` | `cep` | não | PENDENTE (não limpo) | CONFIRMADA_LIVE visual |
| Logradouro | `credorLogradouro` | `logradouro` | não | PENDENTE | CONFIRMADA_LIVE visual |
| Número | `credorNumero` | `numero` | não | PENDENTE | CONFIRMADA_LIVE visual |
| Complemento | `credorComplemento` | `complemento` | não | Java opcional | CONFIRMADA_LIVE |
| Bairro | `credorBairro` | `bairro` | não | PENDENTE | CONFIRMADA_LIVE visual |
| UF | `credorUf` | `uf` | não | PENDENTE | CONFIRMADA_LIVE visual |
| Cidade | `credorCidade` | `cidade` | não | PENDENTE; **não** disabled (diferente do devedor) | CONFIRMADA_LIVE |
| Telefone | `credorTelefone` | `numero` | não | PENDENTE | CONFIRMADA_LIVE visual |

Java `EMAIL` credor oculto — ausente live.

## Dados complementares (7)

| Nome | `formcontrolname` | id | Obrig. visual | maxLength | Java |
|---|---|---|---|---|---|
| Número da cota de consórcio | `cotaConsorcio` | `cotaConsorcio` | não | 6 | `NUMERO_COTA_CONSORCIO` `[true, false]` |
| Número do grupo de consórcio | `grupoConsorcio` | `grupoConsorcio` | não | 6 | `GRUPO_CONSORCIO` `[true, false]` |
| Índice | `indice` | `indiceComplementar` | **sim** | — | `INDICE_SIGLA` `[true, true]` |
| Taxa mora (%) | `taxaMora` | `taxaMora` | não | — | `MORA_TAXA` `[true, false]` |
| Taxa multa (%) | `taxaMulta` | `taxaMulta` | não | — | `MULTA_TAXA` `[true, false]` |
| Taxa contrato | `taxaContrato` | `taxaContrato` | não | — | `VALOR_TAC` Java oculto — mapeamento **PENDENTE** |
| Taxa administrativa | `totalTaxaAdmin` | `totalTaxaAdmin` | não | — | `TOTAL_TAXA_ADMIN` `[true, false]` |

`FUNDO_RESERVA_PREV` Java visível opcional: **ausente** no DOM live.

## Documentos

Heading **Documentos** visível. Nenhum `input`/`nz-select` capturado no inventário (provável dropzone `nz-upload`). **Upload não executado.** Evidência de campos internos: PENDENTE. Java `MatrizDados*` não modela esta seção na PAGE-02.

## Contagens

| Conjunto | Qtd |
|---|---|
| Campos casca (Gate 0 = Gate 1) | 47 |
| Com `*` visual na casca | 23 |
| Campos da linha veículo (Sim) | 5 |
| Campos da linha veículo (Não) | 8 |
| Radios / checkboxes na casca | 0 |
