# Cenários — imagens

```gherkin
  @p0 @imagens @mt
  Cenário: PDF acima de 3,5 MB no MT
    Dado um contrato do DETRAN-MT em homologação descartável
    Quando anexo um PDF de 4 MB na tela individual
    Então vejo "Documento para o estado de MT, não pode exceder 3,5 MB."
    E o arquivo não é enviado

  @p1 @imagens
  Cenário: Alternar filtro protocolo vs contrato+chassi
    Dado a tela de imagem por tela
    Quando aciono "Mudar Filtro"
    Então os campos de contrato e chassi substituem o protocolo
```
