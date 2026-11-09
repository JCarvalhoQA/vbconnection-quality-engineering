# Auditoria técnica — Etapa 15

**HEAD auditado:** `90946ee` (merge do [PR #13](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/pull/13)).  
**Data:** 2026-11-09.  
**Fonte:** repositório local sincronizado com `origin/main` + GitHub Actions.

## Escopo

Inspeção estrutural PAGE-02 (casca, campos, `*`, condicionais, TG, credor). Não é homologação de registro de contrato nem de DETRAN/B3.

## Implementação

| Item | Evidência |
|---|---|
| UFs estruturais | 21 (`STRUCTURAL_UFS_IMPLEMENTED`) |
| Specs `*-estrutural.spec.ts` | 21 arquivos (BA/CE/RO dedicados; demais via `definirEstruturalPage02`) |
| Cenários mocked PAGE-02 | 21 (`@mocked`) |
| Cenários live-readonly PAGE-02 | 21 (`@live-readonly`, gated por flag + Environment) |
| SE | `NOT_APPLICABLE` — formulário indisponível |
| Fixture Java de MA | ausente (correto) |

## Execuções locais desta etapa (branch de consolidação)

| Comando | Resultado |
|---|---|
| `npm run typecheck` | aprovado |
| `npm run test:unit` | 90 passed |
| `npm run matriz:compare` | overlap=20 mismatch=0 missing=0 extra=0 |
| `npm run quality:gates` | Gates 1–6 PASS (Gate 4 PASS com `QUALITY_GATES_REQUIRE_E2E=1`) |
| PAGE-02 mocked 21 UFs | 21 passed / 0 failed / 0 skipped |
| Regressão mocked completa | 100 passed / 3 skipped / 0 failed / 0 flaky |
| Mutation | 420 detectadas / 0 sobreviventes / 42 inválidas / score 1.00 |

Skips da regressão: 2× SE registro (`formularioIndisponivel`) + 1× `test.fixme` em recuperação de senha (API 500). Nenhum skip estrutural PAGE-02.

## GitHub Actions (verificável)

Últimos `workflow_dispatch` live-readonly na `main`:

| Run | SHA | Conclusão | UFs |
|---|---|---|---|
| [42267723718](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718) | `83bcb5ed` | success | 15 UFs (AC–RO, sem lote 4/5) |
| [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) | `a65997cc` | success | lote 4 isolado RR,RS,SC,SP |

Nenhum live após o PR #13. Nenhum live de MA/TO. Runs posteriores ao lote 4 são mocked de PR.

## Workflow

`.github/workflows/playwright-tests.yml`: PR → mocked; `workflow_dispatch` live só com `github.ref == refs/heads/main` + Environment `live-readonly`. Live não é required check de merge/deploy do produto.

## Proteções preservadas

`workers=1`, `fullyParallel=false`, `retries=0` no live; `persistGuard`; sanitização de artifacts; trace/vídeo off no live; `AUTH_PASSWORD_EXPIRED` intacto.

## Lacunas de evidência

- Live MA/TO: `MA_TO_LIVE_PENDING`
- Live 21/21 no SHA atual: `PENDING`
- Credencial Master: `BLOCKED_SECURITY_CREDENTIAL_ROTATION` (secret `updated_at` 2026-11-05T18:14:39Z, anterior ao run 42220549160)
