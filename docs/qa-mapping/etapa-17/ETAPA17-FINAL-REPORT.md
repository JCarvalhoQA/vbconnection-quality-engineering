# Relatório final — Etapa 17

**Main:** `4ff36988a42a30b06374a3acd66fefd44689ea00` (PR #17 integrado)
**Branch:** `docs/playwright-etapa-17-functional-discovery`

Discovery dos 15 negativos restantes. Inventário 83 **inalterado** (42/4/30/4/3). Nenhum CT promovido a Automatizado. Nenhum fluxo persistente. Nenhum live autenticado.

## 1. SHA da `main`

`4ff36988a42a30b06374a3acd66fefd44689ea00`

## 2. IDs dos 15 cenários

Grupo A (`RULE_NOT_CONFIRMED`): CT-050, CT-051, CT-054, CT-055, CT-060, CT-061, CT-072, CT-073, CT-075.

Grupo B (`DEPENDENCY_MISSING`): CT-064, CT-070, CT-077, CT-080, CT-081, CT-082.

## 3. Regras confirmadas (intenção do CT na NX)

Nenhuma. Nome do cenário e regra v2 **não** foram usados como prova.

## 4. Regras parcialmente confirmadas

| ID | O que está confirmado | O que falta |
|---|---|---|
| CT-050 | Campo chassi, `required`, `maxLength=21` live BA | Rejeição ≠ 17, charset, copy, camada |
| Grupo B | Rotas pedidas, permissões v2, comportamento legado documentado | DOM NX, copy NX, contratos NX |

## 5. Regras não confirmadas (intenção)

CT-050 (rejeição), CT-051, CT-054, CT-055, CT-060, CT-061, CT-072, CT-073, CT-075.

## 6. Cenários com POM pendente

CT-064, CT-070, CT-072, CT-073, CT-075, CT-077, CT-080, CT-081, CT-082.

PAGE-02 (CT-050/051/054/055/060/061) já tem `contratoPage.ts` / `veiculoSection.ts`. Nenhum POM vazio de PAGE-03…08 foi criado.

## 7. Cenários com contrato API pendente

CT-051 (GET documento), CT-054 (timeout registrar), CT-060 (duplicidade), CT-064 (busca aditivo).

## 8. Cenários liberados para automação

**0** de 15. `READY_FOR_AUTOMATION` = nenhum.

## 9. Perguntas para desenvolvimento

18 perguntas objetivas em `QUESTIONS-FOR-DEVELOPERS.md` (chassi, CPF/CNPJ, HTTP, lote, imagem, permissão). Prioridade máxima: CT-055, CT-050, CT-051.

## 10. Mapeamento PAGE-03 a PAGE-08

Rotas pedidas em `config/nxPages.ts` alinhadas a `PAGE-INVENTORY.md`. DOM NX `NAO_MAPEADO`. PAGE-HOME ≠ PAGE-08. Detalhe em `NX-PAGE-MAPPING.md`. Sem inspeção autenticada.

## 11. Arquitetura proposta de Page Objects

Desenho por domínio (`aditivo/`, `lote/`, `imagem/`) em `PAGE-OBJECT-ARCHITECTURE.md`. Reuso de `FormPage`, `LoaderComponent`, `gotoApp`, `persistGuard`. Implementação **adiada** até DOM comprovado.

Helper readonly desta etapa: catálogo `config/nxPages.ts` + unitário `tests/nxPages.test.ts` (rotas e `pom=null` para PAGE-03…08).

## 12. Resultados da regressão

| Suíte | Resultado |
|---|---|
| `npm ci` | ok |
| `npm run typecheck` | ok |
| `npm run test:unit` | 96 passed (93 anteriores + 3 `nxPages`) |
| `npm run test:mutation` | 5 passed · score 1.00 (420 detectadas / 0 sobreviventes / 42 inválidas — catálogo) |
| `npx playwright test --grep-invert @live-readonly` | **102 passed, 3 skipped** |
| Live-readonly | **não executado** |

Skips conhecidos: SE (2) + recuperação de senha 500 (1). Nenhum skip novo. Nenhum teste persistente novo.

## 13. Status dos Quality Gates

`npm run matriz:compare`: overlap=20 mismatch=0 missing=0 extra=0.

`npm run quality:gates`: gates 1–6 **PASS**. Live acumulado no SHA atual permanece PENDING. Credencial `BLOCKED_SECURITY_CREDENTIAL_ROTATION`. Fixture Java de MA ausente (correto).

## 14. Situação de segurança

`BLOCKED_SECURITY_CREDENTIAL_ROTATION`. Sem inspeção autenticada, sem Environment `live-readonly`, sem POST/upload. `persistGuard` inalterado. Sem secrets nos artefatos. Detalhe em `SECURITY-STATUS.md`.

## 15. Arquivos criados

```text
config/nxPages.ts
tests/nxPages.test.ts
docs/qa-mapping/etapa-17/TECHNICAL-AUDIT.md
docs/qa-mapping/etapa-17/RULE-CONFIRMATION-MATRIX.md
docs/qa-mapping/etapa-17/QUESTIONS-FOR-DEVELOPERS.md
docs/qa-mapping/etapa-17/NX-PAGE-MAPPING.md
docs/qa-mapping/etapa-17/PAGE-OBJECT-ARCHITECTURE.md
docs/qa-mapping/etapa-17/API-CONTRACT-INVENTORY.md
docs/qa-mapping/etapa-17/SCENARIO-TESTABILITY-MATRIX.md
docs/qa-mapping/etapa-17/PRIORITIZED-BACKLOG.md
docs/qa-mapping/etapa-17/SECURITY-STATUS.md
docs/qa-mapping/etapa-17/ETAPA17-FINAL-REPORT.md
```

Inventário canônico (`SCENARIO-INVENTORY.*`) **não** alterado.

## 16. Commits

Nesta branch, nesta ordem:

1. `3aa3aa3` — `test: catalog NX PAGE-HOME and PAGE-02..08 routes without unverified POMs`
2. docs — `docs: record etapa 17 functional discovery of remaining negative scenarios`

SHA do commit de docs no histórico da branch após publicação.

## 17. PR

Título: `docs: map negative scenario dependencies and Nova UX testability`. Sem merge automático. Sem workflow live.

## 18. Riscos e recomendações

- Live 0 no SHA atual. Master sem rotação comprovada após vazamento.
- v2 ≠ NX (limites MT 3,5 / Java 4 / lote 12). Sessão mock sem `IMAGEM_UPLOAD`.
- Factory de chassi 17 chars **não** é regra de UI (`maxLength` 21 em BA).
- Inventariar 17 testes negativos agora inflaria cobertura falsa.

**Próximo:**

1. PO/DEV responder CT-050, CT-051, CT-055.
2. Rotacionar credencial Master e comprovar.
3. Inspeção readonly PAGE-03/05/07/08 (sem Registrar/Upload).
4. Só então Etapa 18 de implementação seletiva.
