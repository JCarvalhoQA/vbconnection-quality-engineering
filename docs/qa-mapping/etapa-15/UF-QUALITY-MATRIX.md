# Matriz de qualidade por UF — Etapa 15

Indicadores derivados de `LIVE-FIELD-INVENTORY.json`, allowlist estrutural, `mock-vs-java.json` e `docs/qa-mapping/evidence/live-uf-runs.json`. Mocked desta tabela: execução local 2026-11-09 na branch de consolidação (21/21 PAGE-02 `@mocked`).

**Não confundir** `MOCKED_PASSED` com live, nem `LIVE_PASSED_HISTORICAL` com live do SHA `90946ee`.

Classificação:

| Código | Significado |
|---|---|
| IMPLEMENTED | Spec estrutural PAGE-02 presente |
| MOCKED_PASSED | Estrutural `@mocked` aprovado na evidência local/CI disponível |
| LIVE_PASSED | Live no SHA atual (nenhuma UF) |
| LIVE_PASSED_HISTORICAL | Live em SHA anterior |
| LIVE_PENDING | Implementada, sem live |
| BLOCKED | Novo live bloqueado pela credencial Master |
| NOT_APPLICABLE | SE sem formulário |

Novo live de **todas** as 21 UFs permanece `BLOCKED_SECURITY_CREDENTIAL_ROTATION` até rotação comprovada.

| UF | Impl. | Mocked | Live | Run histórico | Cobre SHA atual | Campos | `*` | TG | Java | Novo/usado UI |
|---|---|---|---|---|---|---:|---:|---|---|---|
| AC | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 49 | 25 | não | sim | não |
| AP | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 49 | 25 | não | sim | não |
| BA | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 47 | 23 | não | sim | sim |
| CE | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 68 | 25 | sim | sim | não |
| DF | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 50 | 20 | não | sim | não |
| ES | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 58 | 21 | sim | sim | não |
| MA | IMPLEMENTED | MOCKED_PASSED | LIVE_PENDING | — | não | 68 | 25 | sim | **não** | não |
| MG | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 49 | 25 | não | sim | não |
| MS | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 48 | 27 | não | sim | não |
| MT | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 45 | 17 | não | sim | não |
| PB | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 47 | 25 | não | sim | não |
| PE | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 47 | 24 | não | sim | não |
| PR | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 64 | 22 | sim | sim | não |
| RJ | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 70 | 25 | sim | sim | não |
| RN | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 47 | 30 | não | sim | não |
| RO | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42267723718 | não | 52 | 11 | não | sim | não |
| RR | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42281730173 | não | 49 | 25 | não | sim | não |
| RS | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42281730173 | não | 54 | 24 | não | sim | não |
| SC | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42281730173 | não | 47 | 20 | não | sim | não |
| SP | IMPLEMENTED | MOCKED_PASSED | LIVE_PASSED_HISTORICAL | 42281730173 | não | 50 | 26 | não | sim | não |
| TO | IMPLEMENTED | MOCKED_PASSED | LIVE_PENDING | — | não | 48 | 16 | não | sim | não |
| SE | NOT_APPLICABLE | MOCKED_SKIPPED | NOT_APPLICABLE | — | não | 1 | 1 | não | não | — |

## Notas por UF crítica

**MA** — UI confirmada no inventário (idCombo 238, TG, tipoEspecie, pagamento/juros). Sem `fixtures/matriz/MA.json`. Live: PENDING. Mocked: PATH `uiFormMock`.

**TO** — Java presente, sem TG. Live: PENDING. Mocked: aprovado.

**SE** — GATE3 sem formulário. Fora das 21.

**Documentos** — heading instável BA vs CE; mocked não afirma Documentos (sem `/form/documentos`).

**Commit validado mocked:** branch `feat/playwright-etapa-15-quality-consolidation` (local 2026-11-09). Live histórico: SHAs `83bcb5ed` e `a65997cc`, não o HEAD atual.
