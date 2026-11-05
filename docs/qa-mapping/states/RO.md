# RO — registro de contrato

- ID Playwright/HMG: `não está na suíte 19`
- Campos visíveis (matriz): **58**
- Campos obrigatórios (matriz): **13**
- Seções visíveis: Agente financeiro, Veículo, Contrato, Devedor, Credor, Dados complementares, Aditivo (matriz de campos)
- Alerta devedor (POM): nenhum mapeado
- Trava UF devedor (POM): não
- Web PKI (POM): não

Confiança das regras de campo: **CONFIRMADO_CODIGO**. Locators de preenchimento feliz: **CONFIRMADO_TESTE** só no recorte do POM (destino, agente, chassi, anos, tipo, número, data, devedor). Demais campos: locator **NÃO_ANALISADO** na Nova UX.

## Campos obrigatórios por etapa

### Agente financeiro

- Obrigatórios: NUMERO_DOCUMENTO
- Opcionais visíveis: CODIGO_DETRAN, NOME

### Veículo

- Obrigatórios: NUMERO_CHASSI, NUMERO_RESTRICAO
- Opcionais visíveis: ANO_FABRICACAO, ANO_MODELO, PLACA, PLACA_UF, RENAVAM

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO
- Opcionais visíveis: TIPO_CONTRATO, DATA_CONTRATO, VIGENCIA_CONTRATO, COMISSAO_VALOR, DATA_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_PARCELA, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL, PENALIDADE_DESCRICAO, DATA_CADASTRO, DATA_ASSINATURA

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_MUNICIPIO, END_UF
- Opcionais visíveis: END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_CEP, TEL_DDD, TEL_NUMERO, EMAIL

### Credor

- Obrigatórios: END_MUNICIPIO, END_UF
- Opcionais visíveis: END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_CEP, TEL_DDD, TEL_NUMERO, EMAIL

### Dados complementares

- Obrigatórios: nenhum
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, INDICE_SIGLA, MORA_TAXA, VALOR_TAC

### Aditivo (matriz de campos)

- Obrigatórios: nenhum
- Opcionais visíveis: ADITIVO_DATA

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `True`.

## Cenários específicos

- SCN-CTR-RO-01 registro veículo novo (se o indicador existir).
- SCN-CTR-RO-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-RO-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
