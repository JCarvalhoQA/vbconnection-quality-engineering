# Relatório final — Etapa 18

**Main:** `4ff36988a42a30b06374a3acd66fefd44689ea00`
**Branch:** `feat/playwright-etapa-18-critical-functional-coverage`

## 1. SHA da `main`

`4ff36988a42a30b06374a3acd66fefd44689ea00` (PR #17). PR #18 (Etapa 17) segue aberto.

## 2. Requisitos Confluence

- [Registro de Contrato e Aditivo por Tela](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2088435715) — fluxo das seis etapas; CT001–CT018 do espaço VA
- [DETRAN-BA](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2106490952) — gravame 8 dígitos; parcelas/financiamento sem negativo
- [Imagem de contrato](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2130214940) — upload/download/excluir (protocolo de cliente **não usado**)
- Knowledge MCP `vbauto`: `NO_KEY`

## 3. Jira

VA-1719 / VA-1718 (telas NX sem detalhe de campos). VA-1774 já coberto. VA-1829 é upload de Documentos Seguros, fora de PAGE-08.

## 4. Maior risco

Registro POST (falso sucesso) e upload de imagem. Imagem bloqueada por UI_NOT_MOUNTED. B3 bloqueado por persistGuard.

## 5. Positivos implementados

CT-047 — POST registrar BA com chassi/número no payload e toast de sucesso.

## 6. Negativos implementados

CT-084 gravame maxlength 8; CT-085 parcelas sem `-`; CT-086 financiamento sem `-`.

## 7. Exceções implementadas

CT-053 instâncias 400 e 503 (500 já existia). Sem copy inventada. Form preservado.

## 8. Cobertura contrato

Payload BA + 18 UFs do flow + 21 estruturais. Regras Confluence BA não generalizadas.

## 9. Cobertura imagem

Navegação das rotas pedidas sem POST de upload. Fixtures sintéticas. **0** CT-077–083 automatizados.

## 10. Regras por UF

Novos CTs: **BA**. SE N/A. CE/RO/MA fora do DetranUf de registro.

## 11. Page Objects novos

Nenhum POM vazio. `ContratoPage.esperarRegistroFuncional` apenas.

## 12. Mocks e fixtures

`registrarPayload.ts`; `fixtures/imagens/arquivosSinteticos.ts`. Mock registrar 400/503 via `registrarStatus` já existente.

## 13. Assertions funcionais

POST método/URL/corpo; HTTP status; toast de sucesso ausente ou presente; maxlength; strip de sinal; preservação do número do contrato.

## 14. Unitários

101 passed.

## 15. Playwright mocked

111 passed / 3 skipped.

## 16. Mutation

1.00 (420 / 0 / 42).

## 17. Quality Gates

1–3 e 5–6 PASS. Gate 4 SKIPPED local (CI exige `QUALITY_GATES_REQUIRE_E2E=1`).

## 18. Inventário

86 lógicos. Automatizado 45 · parcial 4 · mapeado 30 · bloqueado 4 · N/A 3.

## 19–21. Arquivos, commits, PR

Ver histórico da branch e o PR publicado.

## 22. CI

Aguardando o PR. Sem workflow live.

## 23. Lacunas

PAGE-07/08 não montam. CT-050/051/054/055/060/057. Copy de erro HTTP. Master sem rotação.

## 24. Próximo lote

Rotacionar Master; inspecionar DOM real de imagem; só então POM PAGE-08 e limites MT/SC/MS. Datas/ano ±1 após copy NX.
