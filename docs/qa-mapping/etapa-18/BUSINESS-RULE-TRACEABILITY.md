# Rastreabilidade regra → cenário → spec

Links Confluence/Jira abaixo foram lidos via MCP Atlassian. Nenhum URL foi inventado.

| ID | Requisito | Confluence | Jira | Função | UF | Tipo | P | Spec | Mock | Resultado |
|---|---|---|---|---|---|---|---|---|---|---|
| CT-047 | Registro com dados válidos gera confirmação | [2088435715 CT007](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2088435715) | VA-1774 (atalho) | Contrato | BA (+18 no flow) | Positivo | P0 | `contrato-positivo.spec.ts` | POST registrar 200 `{protocolo,status:RECEBIDO}` | local passed |
| CT-046 | Sem veículo não registra | toast já conhecido | — | Contrato | 18 UFs | Negativo | P0 | `registro-contrato.flow.ts` | — | pré-existente |
| CT-053 | HTTP registrar sem sucesso | — | — | Contrato | BA | Exceção | P0 | `api-negativos.spec.ts` + `contrato-excecoes.spec.ts` | 400/500/503 corpo `{}` | local passed |
| CT-084 | Gravame ≤ 8 dígitos | [2106490952](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2106490952) | — | Contrato | BA | Negativo | P1 | `contrato-negativo.spec.ts` | front | local passed |
| CT-085 | Parcelas não negativas | idem CT008 | — | Contrato | BA | Negativo | P1 | `contrato-negativo.spec.ts` | front | local passed |
| CT-086 | Financiamento não negativo | idem CT011 | — | Contrato | BA | Negativo | P1 | `contrato-negativo.spec.ts` | front | local passed |
| CT-052 | Tab datepicker não POST | — | — | Contrato | BA | Negativo | P1 | `contrato-negativos.spec.ts` | — | pré-existente |
| CT-057 | Envio B3 | CT017/CT018 2088435715 | — | Contrato | — | Exceção | P0 | — | persistGuard aborta | **não automatizado** |
| CT-078 | Busca + upload imagem | [2130214940](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2130214940) | [VA-1719](https://qualitydigital.atlassian.net/browse/VA-1719) | Imagem | — | Positivo | P0 | — | — | **UI_NOT_MOUNTED** |
| CT-077 | ZIP lote | v2 docs | [VA-1718](https://qualitydigital.atlassian.net/browse/VA-1718) | Imagem | — | Negativo | P1 | — | — | **UI_NOT_MOUNTED** |
| CT-080–082 | Limites PDF MT/SC/MS | v2 upload-limits | — | Imagem | MT/SC/MS | Negativo | P1 | fixtures só | — | **UI_NOT_MOUNTED** |

IDs Confluence CT001–CT018 **não** coincidem com CT-001–CT-086 do dest-repo.
