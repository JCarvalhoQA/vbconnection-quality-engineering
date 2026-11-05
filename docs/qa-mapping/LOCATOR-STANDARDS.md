# Padrão de locators

Prioridade (alinhada ao pedido e ao POM já existente):

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByTestId()`
5. atributo estável (`id` de produto, `formcontrolname`)
6. CSS estrutural (`app-contrato-cadastro-devedor-section`) só com âncora de seção

Evitar: XPath absoluto, classes geradas (`ng-tns-*`, `cdk-focused`), `nth()` sem justificativa, IDs temporários Angular.

## Padrões já adotados no repositório

| Situação | Padrão atual | Risco |
|---|---|---|
| Combobox NG-ZORRO | click + `input.fill` + opção em `.cdk-overlay-pane` | overlay compartilhado; usar `.last()` só com texto exact |
| `nz-select#tipoContrato` | locator de tag+id | `#tipoContrato` sozinho quebra strict mode |
| Datas | `#dataContrato input` + `Tab` | Enter submete o form (**CONFIRMADO_TESTE**) |
| Devedor | IDs prefixados `#devedorCep` | `#enderecoCep` duplicado quebrou 38 testes |
| Overlay Blip | abort de rede + CSS hide + `force: true` no submit | flaky se o hide falhar |
| Navegação newfront | sempre `goto('/')` + `pushState` | deep link HTTP 404 |

## data-testid recomendados

| Elemento | Motivo |
|---|---|
| Toggle mostrar senha | botão sem nome acessível no snapshot |
| `#expirada-*` labels | placeholders idênticos |
| Modal veículo | Chassi só por placeholder |
| Upload lote | `nz-upload` sem role de botão estável |
| Lista de destinos | opções CDK sem `role=option` nativo |
| Terceiro garantidor | seção sem POM |

Não alterar o Angular sem autorização. Registrar os IDs aqui até o front incorporar.
