# Ceará — locators PAGE-02

**Status:** CLASSIFICADOS  
**Data:** 2026-11-05  
**Regra:** âncora por `article`/heading; não usar `formcontrolname` sozinho (`uf`, `cidade`, `numero`, `cnpj`, `nome`, `cep`). IDs de veículo `…-veic-{epoch}-n` são INSTAVEL.

## Estáveis — casca

| Alvo | Preferencial | Alternativo | Classe |
|---|---|---|---|
| Destino | `getByRole('combobox', { name: /Destino/i })` | `#destino` | ESTAVEL |
| Alterar destino | `getByRole('button', { name: 'Alterar destino' })` | — | ESTAVEL |
| Agente | `getByRole('combobox', { name: /Agente financeiro/i })` | `#agenteFinanceiroCadastro` | ESTAVEL |
| Código DETRAN | `#codigoAgenteFinanceiro` | — | ESTAVEL |
| Tipo de Contrato | `#tipoContrato` | combobox `/Tipo de Contrato/i` | ESTAVEL |
| Tipo restrição | `#tipoGravame` | combobox `/Tipo de restrição/i` | ESTAVEL |
| Número contrato | `#numeroContrato` | — | ESTAVEL |
| Datas contrato | `#dataContrato` `#liberacaoCredito` `#inicioVigencia` `#finalVigencia` `#dataCadastro` `#dataPagamento` `#epocaPagamento` `#primeiraParcela` `#ultimaParcela` | — | ESTAVEL |
| Taxa juros mês | `#taxaJurosMes` | — | ESTAVEL |
| UF/cidade pagamento | `#ufLocalPagamento` `#cidadeLocalPagamento` | — | ESTAVEL |
| UF/cidade liberação | `#ufLiberacaoCredito` `#cidadeLiberacaoCredito` | **não** `formcontrolname=uf` | COLISAO |
| Devedor | `#devedorCnpj` `#devedorNome` `#devedorCep` `#devedorLogradouro` `#devedorNumero` `#devedorCelular` `#devedorTelefone` `#devedorEmail` `#devedorUf` `#devedorCidade` | — | ESTAVEL / COLISAO em `numero` |
| Credor | `#credorCep` … `#credorEmail` | seção Credor | ESTAVEL_SECAO |
| Índice | `#indiceComplementar` | — | ESTAVEL |

## Terceiro garantidor

Âncora: `article` com heading `Terceiro garantidor`.

| Campo | Preferencial | Classe |
|---|---|---|
| Código | `#terceiroCodigo` | ESTAVEL |
| CPF/CNPJ | `#terceiroCnpj` | ESTAVEL |
| Nome | `#terceiroNome` | ESTAVEL |
| CEP | `#terceiroCep` | ESTAVEL — **não focar** (buscarCep) |
| Logradouro / número / complemento / bairro | `#terceiroLogradouro` `#terceiroNumero` `#terceiroComplemento` `#terceiroBairro` | ESTAVEL |
| UF / Cidade | `#terceiroUf` `#terceiroCidade` | ESTAVEL; cidade disabled |
| Telefone / Celular | `#terceiroTelefone` `#terceiroCelular` | ESTAVEL; `formcontrolname=numero` COLISAO |

## Veículo — âncora obrigatória

```ts
const secao = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Veículos' }) });
```

| Campo | Preferencial em `secao` | Classe |
|---|---|---|
| Chassi | `getByRole('textbox', { name: /^Chassi/i })` | ESTAVEL_SECAO |
| Situação do chassi | `getByRole('combobox', { name: /Situação do chassi/i })` | ESTAVEL_SECAO |
| Gravame | `getByRole('textbox', { name: /gravame\|restrição/i })` | ESTAVEL_SECAO |
| Zero km | `getByRole('combobox', { name: /Veículo zero km/i })` | ESTAVEL_SECAO |
| Ano fabricação | `getByRole('textbox', { name: /Ano fabricação/i })` | ESTAVEL_SECAO |
| Ano modelo | `getByRole('textbox', { name: /Ano modelo/i })` | ESTAVEL_SECAO |
| Tipo espécie | `getByRole('combobox', { name: /Tipo espécie/i })` | ESTAVEL_SECAO |
| Marca / modelo | `getByRole('combobox', { name: /Marca \/ modelo/i })` | ESTAVEL_SECAO |
| UF da placa | `getByRole('combobox', { name: /UF da placa/i })` | COLISAO se `uf` global |
| Placa / RENAVAM | textbox `/^Placa/` `/RENAVAM/` | ESTAVEL_SECAO |
| Novo / usado | **ausente na CE** | — |
| Salvar | `getByRole('button', { name: /^Salvar$/i })` | não clicar live-readonly |
| Excluir | `getByRole('button', { name: /Excluir veículo/i })` | ESTAVEL_SECAO |
| Dialog / Cancelar | **ausentes** | não usar |

## POM vs CE (sem alterar o POM)

| POM | CE live |
|---|---|
| `Situação do chassi` se `REMARCADO` | presente — ok se CE entrar na suíte |
| `Novo / usado` se `INDICA_NOVO_USADO` | matriz false + DOM ausente — ok |
| sem `veiculoZeroKm` / placa | default Sim esconde placa; fill de usado/placa não existe |
| `getByRole('dialog')` / Cancelar | inline + Excluir |
| `DetranUf` sem CE | **bloqueio de suíte**, não de locator |
