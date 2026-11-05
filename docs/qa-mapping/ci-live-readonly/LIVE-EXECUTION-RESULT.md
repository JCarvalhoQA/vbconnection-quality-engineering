# Resultado da execução live-readonly

**Status:** evidência do GitHub Actions — **1 passed**, 0 failed, 0 skipped. Não foi simulada com mocks.

## Disparo

```text
gh workflow run "Playwright tests" \
  --ref feat/playwright-uf-mapping-ci-improvements \
  -f mode=live-readonly \
  -f suite=structural \
  -f target=newfront
```

O disparo direto na `main` foi bloqueado pela política do agente (publicar/testar em branch). A feature branch usa o mesmo YAML (`blob 435b9c1c`). O PR #2 já estava mesclado em `main` (`9c849d3`); esta auditoria não fez merge adicional.

| Campo | Valor |
|---|---|
| Run ID | `42082614109` |
| URL | https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42082614109 |
| Job live | https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42082614109/job/127439316899 |
| Evento | `workflow_dispatch` |
| Branch | `feat/playwright-uf-mapping-ci-improvements` |
| SHA | `3a1c6197e47e4b26cace9e643342b1e38e4c3264` |
| Ator | `JCarvalhoQA` |
| Conclusão do workflow | **success** |
| Duração do job live | ~55s (checkout → 1 teste 19,7s) |

## Jobs

| Job | Esperado | Observado |
|---|---|---|
| Mocked | skipped | **skipped** (0 steps) |
| Live readonly | executado | **success** |

Env efetivo no job live (valores de secret mascarados pelo GitHub como `***`):

```text
PLAYWRIGHT_MODE=live-readonly
SUITE=structural
PLAYWRIGHT_TARGET=newfront
PLAYWRIGHT_NEWFRONT_URL=https://newfront.vbconnection.info
PLAYWRIGHT_GATE0_LIVE=0
PLAYWRIGHT_GATE1_LIVE=0
PLAYWRIGHT_GATE2_LIVE=0
PLAYWRIGHT_GATE3_LIVE=0
PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1   # após o step Enable live-readonly flags
PLAYWRIGHT_MASTER_USER=***
PLAYWRIGHT_MASTER_PASSWORD=***
PLAYWRIGHT_MASTER_PERFIL=MASTER
```

`ci-select` imprimiu:

```text
args=--project=vbconnection-newfront e2e/contratos/page02 --grep @live-readonly
mode=live-readonly
suite=structural
target=newfront
```

Gates 0–3 permaneceram `0` (`suite=structural`, não `regression`).

## Playwright

```text
Running 1 test using 1 worker
✓ [vbconnection-newfront] › e2e/contratos/page02/ba-estrutural.spec.ts:69:7
  PAGE-02 BA estrutura visual @contrato @page02 @ba @live-readonly
  › valida casca, linha de veículo, zero km e descarte sem Registrar (19.7s)
1 passed (21.1s)
classification=testes-aprovados failed=0 skipped=0
```

JUnit (`test-results/e2e-junit.xml`): `tests=1 failures=0 skipped=0`; property `mode=live-readonly`.  
JSON: `expected=1 skipped=0 unexpected=0 flaky=0`; annotation `{ type: "mode", description: "live-readonly" }`.

O teste live **não** usa `mockLoginApis` nem `mockContratoCadastroApis`. `assertMasterProfile` lança se o perfil autenticado não for `MASTER`; o passed implica autenticação Master comprovada. `assertSemPersistenciaDefinitiva` e o descarte da linha (sem Registrar) fazem parte do mesmo teste.

## Checklist do spec PAGE-02 BA

| Critério | Resultado | Evidência |
|---|---|---|
| Autenticação Master | **pass** | `PLAYWRIGHT_MASTER_PERFIL=MASTER`; secrets mascarados; `assertMasterProfile` no spec; teste não skipped |
| PAGE-02 carregada | **pass** | `contrato.acessar()` + asserts de seções no mesmo teste passed |
| Destino Bahia | **pass** | `selecionarDetran(BA)` + `extractDestinoUfs` contém `BA` |
| Campos e obrigatoriedades visuais | **pass** | `assertObrigatoriosVisuaisLive` |
| Linha de veículo aberta | **pass** | `assertLinhaVeiculoEstrutural` (título do teste: linha de veículo) |
| Zero km | **pass** | mesmo assert / título `zero km` |
| Placa e RENAVAM condicionais | **pass** | `assertLinhaVeiculoEstrutural` (perfil visual BA) |
| Linha descartada sem salvar | **pass** | `assertSemPersistenciaDefinitiva` + título `descarte sem Registrar` |
| Nenhuma operação persistente | **pass** | persistGuard live no `beforeEach` + assert de não persistência; job verde |
| Relatórios / artifacts | **pass** | ver abaixo |

## Artifact

| Campo | Valor |
|---|---|
| Nome | `playwright-42082614109-live-readonly-structural` |
| Tamanho | 204586 bytes |
| Conteúdo | `playwright-report/index.html`, `test-results/e2e-results.json`, `e2e-junit.xml`, `e2e-summary.md` |
| Retention | 14 dias |

Resumo versionado no artifact (`e2e-summary.md`):

```text
Ambiente: live-readonly / newfront
Alvo: https://newfront.vbconnection.info
Status geral: testes concluídos sem falhas
Total 1 · Aprovados 1 · Reprovados 0 · Ignorados 0 · Flaky 0 · Duração 21s
```

Sem `trace.zip` / screenshot de falha (não houve falha). HTML report presente.

## Segredos nos logs

- `PLAYWRIGHT_MASTER_USER` e `PLAYWRIGHT_MASTER_PASSWORD` aparecem como `***`.
- `GITHUB_TOKEN` aparece como `***`.
- Perfil `MASTER` (não é secret) aparece em claro, como esperado.

## Bloqueios restantes

| Item | Estado |
|---|---|
| Skip em Pull Request | esperado; sem mudança |
| Environment `live-readonly` | criado nesta auditoria |
| Secrets Master | presentes no Environment (nomes confirmados) |
| Protection / reviewers no Environment | **ainda ausentes** — opcional; ver `ACTIONS-IMPROVEMENTS.md` |
| Merge automático na `main` | **não realizado** |
| Execução live na `main` via UI | possível após o merge do PR #2; este run usou a feature branch |
