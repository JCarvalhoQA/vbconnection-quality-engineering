# Cenários — aditivo

```gherkin
  @p0 @aditivo
  Cenário: Consulta por protocolo inexistente não registra nada
    Dado que estou na tela de aditivo
    Quando informo um protocolo sintético inexistente e saio do campo
    Então não vejo o botão "Registrar Aditivo"
    E nenhuma chamada de persistência é feita

  @p0 @aditivo-rs
  Cenário: Destino do aditivo RS permanece desabilitado
    Dado que abro "/vbconnection/contrato/aditivo-rs/inserir"
    Então o controle de Destino está disabled
```
