# ES — registro de contrato

- ID Playwright/HMG: `230`
- Campos visíveis (matriz): **73**
- Campos obrigatórios (matriz): **23**
- Seções visíveis: Agente financeiro, Veículo, Contrato, Devedor, Credor, Dados complementares, Terceiro garantidor, Aditivo (matriz de campos)
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
- Opcionais visíveis: MARCA, ANO_FABRICACAO, ANO_MODELO, REMARCADO, PLACA, PLACA_UF, RENAVAM, UF_LICENCIAMENTO, NUMERO_RESTRICAO

### Contrato

- Obrigatórios: NUMERO, NUMERO_PARCELAS, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL
- Opcionais visíveis: TIPO_RESTRICAO, TIPO_CONTRATO, COMISSAO_VALOR, DATA_LIBERACAO_CREDITO, UF_LOCAL_PAGAMENTO, MUNICIPIO_LOCAL_PAGAMENTO, VALOR_PARCELA, VENCIMENTO_ULTIMA_PARCELA, PENALIDADE_DESCRICAO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO, CEL_DDD, CEL_NUMERO, EMAIL

### Credor

- Obrigatórios: nenhum
- Opcionais visíveis: END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO

### Dados complementares

- Obrigatórios: INDICE_SIGLA, MORA_TAXA, MULTA_TAXA
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO

### Terceiro garantidor

- Obrigatórios: nenhum
- Opcionais visíveis: CODIGO_DETRAN, NOME, NUMERO_DOCUMENTO, END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO, TEL_CELULAR

### Aditivo (matriz de campos)

- Obrigatórios: nenhum
- Opcionais visíveis: ADITIVO_NUMERO, ADITIVO_DATA, ADITIVO_NUMERO_REGISTRO

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `False`.

## Cenários específicos

- SCN-CTR-ES-01 registro veículo novo (se o indicador existir).
- SCN-CTR-ES-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-ES-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
