# Cenários — lotes

```gherkin
  @p0 @lote
  Cenário: Nome de arquivo com hífen é orientado como recusado
    Dado que estou no registro em lote
    Então vejo a orientação com exemplo "contratofinanciamento2026.txt"
    E vejo exemplos recusados contendo espaço, hífen e underscore

  @p0 @lote
  Cenário: Não processar lote no newfront nesta etapa
    Dado qualquer arquivo válido
    Então o teste aborta POST de processamento
```
