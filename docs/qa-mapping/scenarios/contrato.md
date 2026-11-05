# Cenários — contrato (Gherkin prioritário)

```gherkin
Funcionalidade: Registro de contrato na Nova UX
  Como operador com CONTRATO_EDITAR
  Quero registrar um contrato por destino DETRAN
  Para que o pedido siga o fluxo do estado

  @p0 @contrato
  Cenário: Destino carrega seções sem wizard
    Dado que estou autenticado em sessão de teste
    Quando abro "/vbconnection/contrato/inserir" via gotoApp
    E seleciono "DETRAN-BA" no combobox Destino
    Então o heading "Agente financeiro" fica visível
    E o heading "Veículos" fica visível
    E o botão "Registrar contrato" fica visível
    E o texto "Carregando configuração do destino…" desaparece

  @p0 @contrato @negativo
  Cenário: Submit sem veículo
    Dado que o destino "DETRAN-SP" está selecionado
    Quando clico em "Registrar contrato"
    Então vejo o toast "Pelo menos 1 veículo deve ser informado."
    E a URL permanece em "/vbconnection/contrato/inserir"

  @p0 @contrato @pr
  Cenário: DETRAN PR trava UF do devedor
    Dado que selecionei "DETRAN-PR"
    Então vejo o alerta de residência no Paraná
    E o combobox UF do devedor permanece conforme travaUfDevedor

  @p1 @contrato
  Cenário: Chassi no modal de veículo
    Dado que adicionei um veículo
    Quando preencho o placeholder "Chassi" com 17 caracteres sintéticos
    E salvo
    Então vejo "Veículo salvo."
```

Hipóteses (não automatizar como regra até confirmar): chassi duplicado no DETRAN, valores financeiros inconsistentes, falha B3.

Mocks devem passar a honrar a matriz Java (BA agente NOME opcional, TG em PR/RJ/ES/CE, etc.).
