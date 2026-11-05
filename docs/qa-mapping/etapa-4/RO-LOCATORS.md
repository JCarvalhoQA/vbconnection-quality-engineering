# Rondônia — locators PAGE-02

**Status:** CLASSIFICADOS  
**Data:** 2026-11-05  
Mesmas regras da CE: seção + `id` estático; IDs `…-veic-{epoch}` INSTAVEL.

## Casca

Reutilizar os `id` da CE quando o campo existe (`#destino`, `#tipoGravame`, `#numeroContrato`, `#ufLiberacaoCredito`, `#devedorCnpj`, …).

| Só RO / atenção | Locator | Nota |
|---|---|---|
| Data assinatura | `#dataAssinatura` | ausente na CE/BA |
| E-mail do contrato | `#emailContrato` | ausente na CE; presente na BA |
| Valor TAC | `#valorTAC` | ausente na CE |
| Data pagamento / época / UF local pagamento | — | **ausentes** na RO |
| Celular devedor | — | **ausente** (CE tem `#devedorCelular`) |
| TG `#terceiro*` | — | **ausente** |
| Índice | `#indiceComplementar` | presente, **sem** `*` |

## Veículo

Âncora `article` + heading Veículos.

| Campo | Locator | vs CE |
|---|---|---|
| Chassi / Gravame / Zero km | iguais à CE | iguais |
| Ano fabricação / modelo | iguais | RO **sem** `*` no ano |
| Situação do chassi / espécie / marca | **ausentes** | não assertar |
| Novo / usado | **ausente** | não assertar |
| UF placa / Placa / RENAVAM | iguais, só com zero km = Não | iguais |
| Excluir veículo | `getByRole('button', { name: /Excluir veículo/i })` | igual |
| Cancelar / dialog | ausentes | igual |

## POM vs RO

| POM | RO live |
|---|---|
| `REMARCADO` → Situação do chassi | Java oculto; DOM ausente — ok |
| `INDICA_NOVO_USADO` | Java oculto; DOM ausente — ok |
| `ANO_FABRICACAO` visível → fill ano | campo existe opcional |
| zero km / placa | POM **não** trata — impacto se a suíte for criada |
| heading TG se `secaoVisivel` | Java `false`; live ausente — ok |
| `DetranUf` sem RO | não incluir na suíte agora |
