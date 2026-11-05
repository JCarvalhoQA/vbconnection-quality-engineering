# DF — registro de contrato

- ID Playwright/HMG: `232`
- Campos visíveis (matriz): **57**
- Campos obrigatórios (matriz): **30**
- Seções visíveis: Agente financeiro, Veículo, Contrato, Devedor, Credor, Dados complementares
- Alerta devedor (POM): nenhum mapeado
- Trava UF devedor (POM): não
- Web PKI (POM): não

Confiança das regras de campo: **CONFIRMADO_CODIGO**. Locators de preenchimento feliz: **CONFIRMADO_TESTE** só no recorte do POM (destino, agente, chassi, anos, tipo, número, data, devedor). Demais campos: locator **NÃO_ANALISADO** na Nova UX.

## Campos obrigatórios por etapa

### Agente financeiro

- Obrigatórios: NOME, NUMERO_DOCUMENTO
- Opcionais visíveis: CODIGO_DETRAN

### Veículo

- Obrigatórios: NUMERO_CHASSI, NUMERO_RESTRICAO
- Opcionais visíveis: MARCA, ANO_FABRICACAO, ANO_MODELO, PLACA, PLACA_UF, RENAVAM

### Contrato

- Obrigatórios: NUMERO, MUNICIPIO_LIBERACAO_CREDITO, UF_LIBERACAO_CREDITO, UF_LOCAL_PAGAMENTO, MUNICIPIO_LOCAL_PAGAMENTO, VALOR_TOTAL, DATA_PAGAMENTO, LOCAL_PAGAMENTO
- Opcionais visíveis: TIPO_RESTRICAO, TIPO_CONTRATO, COMISSAO_VALOR, DATA_LIBERACAO_CREDITO, NUMERO_PARCELAS, VALOR_PARCELA, VENCIMENTO_PRIMEIRA_PARCELA, VENCIMENTO_ULTIMA_PARCELA, IOF_VALOR, JUROS_TAXA_ANUAL, JUROS_TAXA_MENSAL, PENALIDADE_DESCRICAO

### Devedor

- Obrigatórios: NUMERO_DOCUMENTO, NOME, END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO

### Credor

- Obrigatórios: END_LOGRADOURO, END_NUMERO, END_BAIRRO, END_MUNICIPIO, END_UF, END_CEP, TEL_DDD, TEL_NUMERO
- Opcionais visíveis: END_COMPLEMENTO

### Dados complementares

- Obrigatórios: nenhum
- Opcionais visíveis: NUMERO_COTA_CONSORCIO, GRUPO_CONSORCIO, INDICE_SIGLA, MORA_TAXA, MULTA_TAXA, CORRECAO_MONETARIA

## Diferenças a exercitar

- Veículo novo/usado: `INDICA_NOVO_USADO` = `Oculto`.
- Renavam: `Opcional`. Não concluir opcionalidade só pela ausência de `*` na UI.
- Ano fabricação: matriz `Opcional`; flag Playwright `anoFabricacaoObrigatorio` = `False`.

## Cenários específicos

- SCN-CTR-DF-01 registro veículo novo (se o indicador existir).
- SCN-CTR-DF-02 registro veículo usado / placa+renavam quando visíveis.
- SCN-CTR-DF-03 submit com obrigatórios da matriz vazios (mock, sem persistir).

Navegação voltar/avançar de wizard: **não aplicável** no recorte POM (form único). Persistência ao voltar: **NÃO_ANALISADO**.
