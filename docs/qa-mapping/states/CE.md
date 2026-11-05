# CE — registro de contrato

- ID Playwright/HMG: `não está na suíte 19`
- Campos visíveis (matriz): **83**
- Campos obrigatórios (matriz): **26**
- Seções visíveis: Agente financeiro, Veículo, Contrato, Devedor, Credor, Dados complementares, Terceiro garantidor, Aditivo (matriz de campos)
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
- Opcionais visíveis: MARCA, MODELO, ANO_FABRICACAO, ANO_MODELO, REMARCADO, PLACA, PLACA_UF, RENAVAM, TIPO_ESPECIE

### Contrato

- Obrigatórios: NUMERO, TIPO_RESTRICAO, DATA_CONTRATO, DATA_LIBERACAO_CREDITO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, UF_LOCAL_PAGAMENTO, MUNICIPIO_LOCAL_PAGAMENTO, NUMERO_PARCELAS, VALOR_TOTAL, VENCIMENTO_PRIMEIRA_PARCELA, JUROS_TAXA_MENSAL, DATA_PAGAMENTO, EPOCA_PAGAMENTO
- Opcionais visíveis: TIPO_CONTRATO, VIGENCIA_CONTRATO, COMISSAO_VALOR, VALOR_PARCELA, VENCIMENTO_ULTIMA_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, PENALIDADE_DESCRICAO, DATA_CADASTRO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, CEL_DDD, CEL_NUMERO
- Opcionais visíveis: END_NUMERO, END_COMPLEMENTO, TEL_DDD, TEL_NUMERO, EMAIL

### Credor

- Obrigatórios: nenhum
- Opcionais visíveis: END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO, EMAIL

### Dados complementares

- Obrigatórios: nenhum
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, INDICE_SIGLA, MORA_TAXA, MULTA_TAXA, TOTAL_TAXA_ADMIN

### Terceiro garantidor

- Obrigatórios: nenhum
- Opcionais visíveis: CODIGO_DETRAN, NOME, NUMERO_DOCUMENTO, END_LOGRADOURO, END_NUMERO, END_COMPLEMENTO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO, TEL_CELULAR, EMAIL

### Aditivo (matriz de campos)

- Obrigatórios: nenhum
- Opcionais visíveis: ADITIVO_NUMERO, ADITIVO_DATA

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `True`.

## Cenários específicos

- SCN-CTR-CE-01 registro veículo novo (se o indicador existir).
- SCN-CTR-CE-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-CE-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
