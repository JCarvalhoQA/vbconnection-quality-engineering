# Estratégia de mock de API — Etapa 16

## Princípio

Mock configurado pelo teste **não** é evidência de integração DETRAN/B3. Classe: `MOCKED_API_REJECTION`.

`persistGuard` continua LIFO: `POST contratos/registrar` faz `fallback()` no mocked; lote/aditivo/imagem/B3 abortam.

## CT-053

| Item | Valor |
|---|---|
| Rota | `POST` URL contendo `contratos/registrar` |
| Status | 500 |
| Corpo | `{}` — sem mensagem inventada |
| Opção | `mockContratoCadastroApis(page, uf, { registrarStatus: 500 })` |
| Assert UI | Ausência de `Contrato registrado com sucesso.` (copy confirmada no happy path) |
| Assert estado | URL `/vbconnection/contrato/inserir`; heading visível; número do contrato preservado |
| Não asserta | Texto de interceptor HTTP (não documentado na PAGE-02) |

## CT-052

Sem mock de API extra. Observa o datepicker. Garante que Tab **não** dispara `contratos/registrar`.

## O que não foi mockado nesta etapa

| Cenário | Motivo |
|---|---|
| CT-054 timeout | Sem contrato de UI (VA-1585) |
| CT-060 duplicidade DETRAN | Órgão real / contrato não confirmado |
| Upload PAGE-05/07/08 | Sem POM NX; persistGuard já abortaria POST |

Não usar o corpo vazio de 500 como “a API real responde assim”.
