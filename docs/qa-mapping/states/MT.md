# MT — registro de contrato

- ID Playwright/HMG: `233`
- Campos visíveis (matriz): **54**
- Campos obrigatórios (matriz): **20**
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
- Opcionais visíveis: MARCA, ANO_FABRICACAO, ANO_MODELO, PLACA, PLACA_UF, RENAVAM

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, DATA_LIBERACAO_CREDITO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA
- Opcionais visíveis: TIPO_CONTRATO, COMISSAO_VALOR, VALOR_PARCELA, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_MUNICIPIO, END_UF, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_CEP, EMAIL

### Credor

- Obrigatórios: nenhum
- Opcionais visíveis: END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO, EMAIL

### Dados complementares

- Obrigatórios: nenhum
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, INDICE_SIGLA, MORA_TAXA, MULTA_TAXA

### Aditivo (matriz de campos)

- Obrigatórios: ADITIVO_NUMERO, ADITIVO_DATA
- Opcionais visíveis: nenhum

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `False`.

## Cenários específicos

- SCN-CTR-MT-01 registro veículo novo (se o indicador existir).
- SCN-CTR-MT-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-MT-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
