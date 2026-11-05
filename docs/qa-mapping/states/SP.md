# SP — registro de contrato

- ID Playwright/HMG: `1`
- Campos visíveis (matriz): **65**
- Campos obrigatórios (matriz): **39**
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

- Obrigatórios: ANO_FABRICACAO, ANO_MODELO, NUMERO_CHASSI, REMARCADO, NUMERO_RESTRICAO
- Opcionais visíveis: PLACA, PLACA_UF, RENAVAM, MARCA_BEM, MODELO_BEM, VERSAO_MODELO_BEM, TIPO_COMBUSTIVEL_BEM, TIPO_CATEGORIA_VEICULO, DESCRICAO_COR_VEICULO

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, DATA_CONTRATO, VIGENCIA_CONTRATO, DATA_LIBERACAO_CREDITO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA
- Opcionais visíveis: NUMERO_REGISTRO, COMISSAO_VALOR, VALOR_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL, PENALIDADE_DESCRICAO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO, EMAIL

### Credor

- Obrigatórios: END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO, EMAIL

### Dados complementares

- Obrigatórios: INDICE_SIGLA
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, MORA_TAXA, MULTA_TAXA

### Aditivo (matriz de campos)

- Obrigatórios: ADITIVO_NUMERO, ADITIVO_DATA
- Opcionais visíveis: ADITIVO_NUMERO_REGISTRO

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Obrig.`; flag Playwright `anoFabricacaoObrigatorio` = `True`.

## Cenários específicos

- SCN-CTR-SP-01 registro veículo novo (se o indicador existir).
- SCN-CTR-SP-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-SP-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
