# AP — registro de contrato

- ID Playwright/HMG: `225`
- Campos visíveis (matriz): **67**
- Campos obrigatórios (matriz): **38**
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

- Obrigatórios: ANO_FABRICACAO, ANO_MODELO, NUMERO_CHASSI, REMARCADO, UF_LICENCIAMENTO, NUMERO_RESTRICAO
- Opcionais visíveis: MARCA, PLACA, PLACA_UF, RENAVAM, MARCA_BEM, MODELO_BEM, VERSAO_MODELO_BEM, TIPO_COMBUSTIVEL_BEM, TIPO_CATEGORIA_VEICULO, DESCRICAO_COR_VEICULO

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, DATA_CONTRATO, DATA_LIBERACAO_CREDITO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA
- Opcionais visíveis: NUMERO_REGISTRO, COMISSAO_VALOR, VALOR_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL, PENALIDADE_DESCRICAO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: nenhum

### Credor

- Obrigatórios: END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO, EMAIL

### Dados complementares

- Obrigatórios: INDICE_SIGLA
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, MORA_TAXA, MULTA_TAXA, CORRECAO_MONETARIA

### Aditivo (matriz de campos)

- Obrigatórios: nenhum
- Opcionais visíveis: TIPO_ADITIVO, ADITIVO_NUMERO, ADITIVO_DATA, ADITIVO_NUMERO_REGISTRO

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Obrig.`; flag Playwright `anoFabricacaoObrigatorio` = `True`.

## Cenários específicos

- SCN-CTR-AP-01 registro veículo novo (se o indicador existir).
- SCN-CTR-AP-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-AP-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
