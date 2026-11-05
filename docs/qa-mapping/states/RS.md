# RS — registro de contrato

- ID Playwright/HMG: `231`
- Campos visíveis (matriz): **68**
- Campos obrigatórios (matriz): **32**
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

- Obrigatórios: NUMERO_CHASSI
- Opcionais visíveis: MARCA, MODELO, ANO_FABRICACAO, ANO_MODELO, REMARCADO, PLACA, PLACA_UF, RENAVAM, UF_LICENCIAMENTO, NUMERO_RESTRICAO

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, DATA_CONTRATO, DATA_LIBERACAO_CREDITO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA
- Opcionais visíveis: TIPO_CONTRATO, FORMA_CONTRATO, COMISSAO_VALOR, VALOR_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL, PENALIDADE_DESCRICAO, DATA_CADASTRO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO, CEL_DDD, CEL_NUMERO, EMAIL

### Credor

- Obrigatórios: END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO, EMAIL
- Opcionais visíveis: END_COMPLEMENTO

### Dados complementares

- Obrigatórios: nenhum
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, INDICE_SIGLA, MORA_TAXA, MULTA_TAXA, NUMERO_CND, OPCAO_COMPRA

### Aditivo (matriz de campos)

- Obrigatórios: nenhum
- Opcionais visíveis: TIPO_ADITIVO, ADITIVO_NUMERO, ADITIVO_DATA, ADITIVO_NUMERO_REGISTRO

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `False`.

## Cenários específicos

- SCN-CTR-RS-01 registro veículo novo (se o indicador existir).
- SCN-CTR-RS-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-RS-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
