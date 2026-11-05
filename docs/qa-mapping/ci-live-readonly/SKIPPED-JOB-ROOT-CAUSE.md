# Causa raiz do job Live readonly skipped

## Veredito

**Comportamento esperado**, não defeito de configuração do `if`, de branch incompatível, nem de input perdido no Pull Request.

## Evidência da execução original

| Campo | Valor |
|---|---|
| Run ID | `42074098852` |
| URL | https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42074098852 |
| Workflow | Playwright tests (`.github/workflows/playwright-tests.yml`) |
| Evento disparador | `pull_request` |
| Branch | `feat/playwright-uf-mapping-ci-improvements` |
| Commit | `3a1c6197e47e4b26cace9e643342b1e38e4c3264` |
| Inputs efetivos | não aplicáveis (`inputs.*` só existem em `workflow_dispatch`) |
| Env efetivo | `PLAYWRIGHT_MODE=mocked`, `SUITE=regression`, `PLAYWRIGHT_TARGET=newfront` |
| Attempt 1 | Mocked **success**; Live readonly **skipped** (0 steps) |
| Attempt 2 (rerun) | Mocked **success** 7m1s; Live readonly **skipped** 0s |

Job live skipped (attempt 1): https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42074098852/job/127409538446  
Job live skipped (attempt 2): https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42074098852/job/127433833548

Logs do mocked attempt 2:

```text
args=--project=vbconnection-newfront --grep-invert @live-readonly
mode=mocked
suite=regression
80 passed (6.3m)
3 skipped
classification=testes-aprovados failed=0 skipped=3
```

A suíte mockada **inverte** `@live-readonly`. Nenhum teste live foi selecionado, de propósito.

A primeira menção (83 contabilizados / 79 aprovados / 1 flaky / 3 skipped) corresponde à attempt 1; na attempt 2 o flaky passou na retentativa (`retries: 1` em CI) e o total aprovado foi 80, ainda com 3 skipped e 0 failed.

## Condição avaliada

```yaml
if: github.event_name == 'workflow_dispatch' && inputs.mode == 'live-readonly'
```

Para o run `42074098852`:

| Operando | Valor | Resultado |
|---|---|---|
| `github.event_name == 'workflow_dispatch'` | `pull_request` | **false** |
| `inputs.mode == 'live-readonly'` | `inputs` ausente | **false** |
| AND | | **false → skipped** |

O GitHub não cria steps quando o `if` do job é falso: duração ~0s, `steps: []`. Isso não é timeout, nem falha de secret, nem Environment 404.

## Hipóteses descartadas

| Hipótese | Por que não |
|---|---|
| `inputs.mode` mal passado no PR | PR não tem inputs; o fallback `mocked` é o contrato |
| Workflow desatualizado na feature branch | O YAML com o job live já estava no SHA `3a1c619`; o job **apareceu** e foi skipped, não omitido |
| Branch incompatível | A PR aponta para `main`; o workflow dispara em `pull_request` para `main` |
| Environment / secrets ausentes | Só seriam avaliados **depois** de o job iniciar. Skip com 0 steps ocorre antes |
| Permissão do Actions | Actions habilitado; o job Mocked rodou no mesmo workflow |
| Defeito na condição (queria live em PR) | Live em PR é **proibido**: exporia o Environment Master |

A execução `42073794477` (`64e9802`, falha de determinismo da matriz) também skipped o live pelo mesmo motivo (`pull_request`).

## Contraprova

Disparo manual na mesma branch/SHA:

```text
gh workflow run "Playwright tests" \
  --ref feat/playwright-uf-mapping-ci-improvements \
  -f mode=live-readonly \
  -f suite=structural \
  -f target=newfront
```

Run [42082614109](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42082614109):

| Job | Resultado |
|---|---|
| Mocked | skipped (0 steps) — `inputs.mode == 'live-readonly'` |
| Live readonly | iniciado; `environment: live-readonly`; `Validate suite selection` success |

Isso confirma que a condição funciona nos dois sentidos. A condição **não** foi afrouxada para forçar live em PR.

## Código

Nenhuma alteração de `if`, de eventos ou de permissões foi necessária. O skip original era o comportamento da tabela de aceite.
