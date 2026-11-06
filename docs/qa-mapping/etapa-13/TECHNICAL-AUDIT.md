# Etapa 13 — Auditoria técnica da arquitetura Playwright

**Evidência:** `main` @ `21b2f33` (merge PR #11). Inventário `docs/qa-mapping/etapa-5/LIVE-FIELD-INVENTORY.json`. Factory `e2e/contratos/page02/definirEstruturalPage02.ts`.

## Componentes reais

| Nome | Caminho |
|---|---|
| ContratoPage | `pages/contratoPage.ts` |
| VeiculoSection | `pages/fragments/veiculoSection.ts` |
| HomePage / LoginPage | `pages/homePage.ts`, `pages/loginPage.ts` |
| definirTestesEstruturaisPage02 | `e2e/contratos/page02/definirEstruturalPage02.ts` |
| page02Structural | `support/page02Structural.ts` |
| page02LiveSession | `support/page02LiveSession.ts` |
| ufUiProfile | `support/ufUiProfile.ts` |
| uiFormMock | `support/uiFormMock.ts` |
| persistGuard | `support/persistGuard.ts` |
| ngZorroField | `support/ngZorroField.ts` |
| ci-select / uf-lotes / summarize | `scripts/*.mjs` |

## Diagnóstico

| Achado | Severidade | Prioridade | Classificação |
|---|---|---|---|
| Specs por UF são uma linha; lógica na factory | — | — | Acoplamento baixo, reuso alto |
| Mocked não chama `assertCascaPorInventario` | Alta | P1 | Regressão silenciosa de asterisco/casca |
| Campos opcionais inventariados sem assertion | Média | P1 | Cobertura declarada ≠ exercitada |
| `assertCredorDocumentos` não testava ausência | Média | P1 | Corrigido nesta etapa |
| `VeiculoSection` usava `.first()` em chassi/placa | Média | P1 | Corrigido (unicidade) |
| `enviarContrato` usa `force: true` | Baixa | P3 | Só suíte de registro mocked |
| Gates 0–3 e `liveInspect` ainda usam `.first()` | Baixa | P3 | Fora da suíte estrutural das 21 UFs |
| Job live sem `github.ref == main` no YAML | Alta | P0 | Corrigido (YAML + ci-select) |

## Impacto

A suíte detecta bem veículo, TG e Zero km. Não detecta, no caminho mocked, remoção de asterisco de casca.

## Recomendação

Manter factory. Não criar Page Object por UF. Evoluir mocked para casca só quando o mock Angular reproduzir o inventário live sem falso negativo.

## Status

Arquitetura consolidada. Melhorias desta etapa: oráculo de mutação, unicidade de locators de veículo, ausência de Credor/Documentos, live restrito à `main`.

## Limitação

Mutation testing é oráculo local (perfil clonado), não injeta DOM no Newfront.
