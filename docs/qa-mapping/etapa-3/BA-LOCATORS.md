# Bahia — locators PAGE-02 (Gate 1)

**Status:** CLASSIFICADOS  
**Data:** 2026-11-05  
**Regra:** contextualizar por seção/`article`/`form` quando o atributo se repetir. Sem seletor posicional (`nth`, xpath índice) sem justificativa.

## Estabilidade

| Classe | Significado | Uso |
|---|---|---|
| ESTAVEL | `id` estático ou role+nome único na página | preferir |
| ESTAVEL_SECAO | único só dentro do heading/article | obrigatório contextualizar |
| INSTAVEL | `id` dinâmico, texto de overlay CDK, horário do header | não usar como SoT |
| COLISAO | `formcontrolname` ou role repetidos | sempre filtrar por seção ou `id` |
| CODIGO | existe no template Angular local, não visto no bundle live | não automatizar pelo código |

## Origem

| Origem | O que prova |
|---|---|
| LIVE | interagido ou lido no newfront nesta gate |
| POM | `contratoPage.ts` atual — não alterado |
| ANGULAR | `vb-auto-v2` no repositório |
| JAVA | matriz `[visivel, obrigatorio]` |

## Casca — validados por interação

| Alvo | Locator preferencial | Alternativo | Classe | Origem |
|---|---|---|---|---|
| Página | `getByRole('heading', { name: 'Registrar contrato' })` | URL `/contrato/inserir` | ESTAVEL | LIVE + POM |
| Destino | `getByRole('combobox', { name: /Destino/i })` | `#destino` / `formcontrolname=destino` | ESTAVEL | LIVE + POM |
| Alterar destino | `getByRole('button', { name: 'Alterar destino' })` | — | ESTAVEL | LIVE |
| Agente financeiro | `getByRole('combobox', { name: /Agente financeiro/i })` | `#agenteFinanceiroCadastro` | ESTAVEL | LIVE |
| Heading Veículos | `getByRole('heading', { name: 'Veículos' })` | — | ESTAVEL | LIVE + POM |
| Adicionar veículo | `getByRole('button', { name: /Adicionar veículo/i })` | POM `adicionarVeiculo` | ESTAVEL | LIVE + POM |
| Registrar contrato | `getByRole('button', { name: 'Registrar contrato' })` | — | ESTAVEL | LIVE (**não clicar**) |
| Tipo de restrição | `getByRole('combobox', { name: /Tipo de restrição/i })` | `#tipoGravame` | ESTAVEL | LIVE |
| Número do Contrato | `getByRole('textbox', { name: /Número do Contrato/i })` | `#numeroContrato` | ESTAVEL | LIVE |
| Índice | `getByRole('textbox', { name: /^Índice/i })` | `#indiceComplementar` | ESTAVEL | LIVE |

POM `selectOption('DETRAN-BA')` funcionou live (Gate 0 e Gate 1).

## Casca — identificados no DOM, sem clique de persistência

Preferir `#id` estático **ou** role+label. `formcontrolname` só com âncora de seção.

| Campo | Preferencial | Alternativo | Classe |
|---|---|---|---|
| CNPJ agente | `#cnpjAgenteFinanceiro` | seção Agente → textbox CNPJ | ESTAVEL |
| Nome agente | `#nomeAgenteFinanceiro` | — | ESTAVEL |
| Número de registro | `#registroContrato` | — | ESTAVEL |
| Data do contrato | `#dataContrato` | combobox/datepicker label | ESTAVEL |
| Liberação de crédito | `#liberacaoCredito` | — | ESTAVEL |
| Parcelas | `#parcelas` | — | ESTAVEL |
| Valor da parcela | `#parcela` | — | ESTAVEL |
| Venc. 1ª | `#primeiraParcela` | — | ESTAVEL |
| Venc. última | `#ultimaParcela` | — | ESTAVEL |
| IOF | `#iof` | — | ESTAVEL |
| Total financiamento | `#totalFinanciamento` | — | ESTAVEL |
| Comissão | `#comissao` | — | ESTAVEL |
| Penalidade | `#penalidade` | — | ESTAVEL |
| Taxa juros mês | `#taxaJurosMes` | — | ESTAVEL |
| Taxa juros ano | `#taxaJurosAno` | — | ESTAVEL |
| UF liberação | `#ufLiberacaoCredito` | **não** `formcontrolname=uf` | ESTAVEL |
| Cidade liberação | `#cidadeLiberacaoCredito` | **não** `formcontrolname=cidade` | ESTAVEL |
| E-mail do contrato | `#emailContrato` | — | ESTAVEL |
| CPF/CNPJ devedor | `#devedorCnpj` | — | ESTAVEL |
| Nome completo | `#devedorNome` | — | ESTAVEL |
| CEP devedor | `#devedorCep` | — | ESTAVEL |
| Logradouro devedor | `#devedorLogradouro` | — | ESTAVEL |
| Número devedor | `#devedorNumero` | **não** `formcontrolname=numero` | COLISAO |
| Complemento devedor | `#devedorComplemento` | — | ESTAVEL |
| Bairro | `#devedorBairro` | — | ESTAVEL |
| UF devedor | `#devedorUf` | — | COLISAO se usar `uf` |
| Cidade devedor | `#devedorCidade` | disabled até UF | ESTAVEL |
| Telefone devedor | `#devedorTelefone` | **não** `formcontrolname=numero` | COLISAO |
| Credor * | `#credorCep`, `#credorLogradouro`, `#credorNumero`, `#credorComplemento`, `#credorBairro`, `#credorUf`, `#credorCidade`, `#credorTelefone` | seção Credor + label | ESTAVEL_SECAO |
| Cota / grupo / mora / multa / taxa contrato / taxa admin | `#cotaConsorcio` `#grupoConsorcio` `#taxaMora` `#taxaMulta` `#taxaContrato` `#totalTaxaAdmin` | — | ESTAVEL |

## Veículo — linha inline

Âncora obrigatória:

```ts
const secaoVeiculos = page.locator('article').filter({
  has: page.getByRole('heading', { name: 'Veículos' }),
});
```

| Campo | Preferencial (dentro de `secaoVeiculos`) | Alternativo | Classe |
|---|---|---|---|
| Chassi | `getByRole('textbox', { name: /^Chassi/i })` | `getByPlaceholder('Chassi')` | ESTAVEL_SECAO |
| Gravame | `getByRole('textbox', { name: /gravame\|restrição/i })` | `formcontrolname=restricao` na seção | ESTAVEL_SECAO |
| Zero km | `getByRole('combobox', { name: /Veículo zero km/i })` | `formcontrolname=veiculoZeroKm` | ESTAVEL_SECAO |
| Novo / usado | `getByRole('combobox', { name: /Novo\s*\/\s*usado/i })` | `formcontrolname=indicaNovoUsado` | ESTAVEL_SECAO |
| Número motor | `getByRole('textbox', { name: /Número motor/i })` | `formcontrolname=numeroMotor` | ESTAVEL_SECAO |
| UF da placa | `getByRole('combobox', { name: /UF da placa/i })` | **não** `formcontrolname=uf` global | COLISAO |
| Placa | `getByRole('textbox', { name: /^Placa/i })` | `formcontrolname=placa` na seção | ESTAVEL_SECAO |
| RENAVAM | `getByRole('textbox', { name: /RENAVAM/i })` | `formcontrolname=renavam` | ESTAVEL_SECAO |
| Salvar | `getByRole('button', { name: /^Salvar$/i })` | — | ESTAVEL_SECAO; **não clicar** em live-readonly |
| Excluir veículo | `getByRole('button', { name: /Excluir veículo/i })` | — | ESTAVEL_SECAO |
| Cancelar | — | **ausente** | — |
| Dialog | `getByRole('dialog')` | **ausente** | INSTAVEL se usado |

IDs `veiculoChassi-veic-{epoch}-1`, `restricao-veic-…`, `zeroKm-veic-…`, `novoUsado-veic-…`, `ufPlaca-veic-…`, `placa-veic-…`, `renavam-veic-…`, `numMotor-veic-…`: **INSTAVEL**.

Overlays de `nz-select`: `.cdk-overlay-pane` + texto exato da opção. Fechar com Escape se a opção não aparecer. Combobox **disabled** (Destino após seleção) não deve ser clicado — captura retorna vazio.

## POM vs live (sem alterar o POM)

| POM hoje | Live Gate 1 |
|---|---|
| heading + Destino + `DETRAN-BA` | ok |
| placeholder Chassi / Situação do chassi | Chassi ok; **Situação do chassi ausente** na BA |
| Novo/Usado | combobox obrigatório na linha |
| `nz-date-picker#dataPagamento` | **ausente** na BA (Java `DATA_PAGAMENTO` oculto) |
| header logout `/administrador/i` | rótulo **Master** — risco residual (Gate 0 BLK-11) |

## Não usar

- `nth=` na lista de `formcontrolname=uf` / `cidade` / `numero`.
- CSS `#chassi` (o template local usa `id="chassi"`; o live prefixa `veiculoChassi-veic-…`).
- `getByRole('dialog')` para este fluxo.
- Qualquer locator derivado de horário, nome de usuário ou CNPJ do combo.
