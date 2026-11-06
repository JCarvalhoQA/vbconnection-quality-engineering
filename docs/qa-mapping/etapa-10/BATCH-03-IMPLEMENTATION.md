# Lote 3 — implementação

Specs: `e2e/contratos/page02/{pe,pr,rj,rn}-estrutural.spec.ts` via `definirTestesEstruturaisPage02`.

`VeiculoSection.expectCampoInventario` passa a validar `tipoEspecie` e `descricaoCorVeiculo` quando o inventário live os lista (PR/RJ espécie; RJ cor com `*`).

## Executado (mocked)

PAGE-02 lote 3: 4 passed (incluídos nos 15 estruturais mocked).  
CI PR: [42263506849](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42263506849) — 94 passed / 3 skipped / 0 failed / 0 flaky.

## Executado (live-readonly)

Pós-merge, [42267723718](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718) na `main` @ `83bcb5e`:

| Métrica | Resultado |
|---|---|
| UFs | AC, AP, BA, CE, DF, ES, MG, MS, MT, PB, PE, PR, RJ, RN, RO |
| Total | 15 |
| Aprovados | 15 |
| Reprovados | 0 |
| Flaky | 0 |
| Ignorados | 0 |
| Duração | 4m 50s |

PE, PR, RJ e RN passaram no mesmo run da regressão acumulada (`PLAYWRIGHT_UFS` vazio). Sucesso estrutural ≠ homologação de registro.

## Bloqueado

Rotação comprovada da senha Master (`BLOCKED_SECURITY_CREDENTIAL_ROTATION`).

## Não iniciado

Lote 4.
