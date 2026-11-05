# MS — registro de contrato

- ID Playwright/HMG: `226`
- Campos visíveis (matriz): **60**
- Campos obrigatórios (matriz): **37**
- Seções visíveis: Agente financeiro, Veículo, Contrato, Devedor, Credor, Dados complementares, Aditivo (matriz de campos)
- Alerta devedor (POM): nenhum mapeado
- Trava UF devedor (POM): não
- Web PKI (POM): não

Confiança das regras de campo: **CONFIRMADO_CODIGO**. Locators de preenchimento feliz: **CONFIRMADO_TESTE** só no recorte do POM (destino, agente, chassi, anos, tipo, número, data, devedor). Demais campos: locator **NÃO_ANALISADO** na Nova UX.

## Campos obrigatórios por etapa

### Agente financeiro

- Obrigatórios: NOME, NUMERO_DOCUMENTO
- Opcionais visíveis: CODIGO_DETRAN

### Veículo

- Obrigatórios: NUMERO_CHASSI, UF_LICENCIAMENTO, NUMERO_RESTRICAO
- Opcionais visíveis: MARCA, ANO_FABRICACAO, ANO_MODELO, REMARCADO, PLACA, PLACA_UF, RENAVAM

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, DATA_CONTRATO, DATA_LIBERACAO_CREDITO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_PARCELA, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL
- Opcionais visíveis: NUMERO_REGISTRO, COMISSAO_VALOR, IOF_VALOR, PENALIDADE_DESCRICAO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO, CEL_DDD, CEL_NUMERO

### Credor

- Obrigatórios: END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO

### Dados complementares

- Obrigatórios: INDICE_SIGLA
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, MORA_TAXA, MULTA_TAXA

### Aditivo (matriz de campos)

- Obrigatórios: nenhum
- Opcionais visíveis: ADITIVO_NUMERO, ADITIVO_DATA, ADITIVO_NUMERO_REGISTRO

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `True`.

## Cenários específicos

- SCN-CTR-MS-01 registro veículo novo (se o indicador existir).
- SCN-CTR-MS-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-MS-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
