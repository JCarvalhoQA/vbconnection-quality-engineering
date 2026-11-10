# Resultados da validação funcional — Etapa 16

## CT-052 (FRONTEND_VALIDATION)

| Assert | Observado |
|---|---|
| URL permanece `/vbconnection/contrato/inserir` | sim |
| Heading `Registrar contrato` visível | sim |
| Toast `Contrato registrado com sucesso.` ausente | sim |
| `POST contratos/registrar` ausente | sim |
| Mensagem de data inválida | **não afirmada** (não documentada) |
| fill+Tab esvazia o FormControl (nota etapa-2) | **não reproduzido** — valor `10/11/2026` permanece (`ng-valid ng-dirty ng-touched`) |

## CT-053 (MOCKED_API_REJECTION)

| Assert | Observado |
|---|---|
| HTTP 500 no POST `contratos/registrar` | sim |
| Toast de sucesso ausente | sim |
| Permanece na PAGE-02 | sim |
| Número do contrato preservado | sim |
| Copy de erro 5xx | **não afirmada** (não documentada) |
| Integração DETRAN | **não** — mock do próprio teste |

## Não executado (regra ou POM ausente)

CT-050, CT-051, CT-054, CT-055, CT-060, CT-061, CT-064, CT-070, CT-072, CT-073, CT-075, CT-077, CT-080, CT-081, CT-082.
