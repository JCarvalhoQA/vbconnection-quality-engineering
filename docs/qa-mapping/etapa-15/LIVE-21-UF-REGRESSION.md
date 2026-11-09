# Regressão live acumulada das 21 UFs — Etapa 15

**Status:** `PENDING`

## Motivo

1. MA e TO sem live (`MA_TO_LIVE_PENDING`).
2. As 19 UFs com live histórico estão em **dois** jobs e **SHAs anteriores** ao `90946ee`.
3. Novo live bloqueado por `BLOCKED_SECURITY_CREDENTIAL_ROTATION`.

Não declarar 21/21 live.

## Evidência histórica (não cobre o SHA atual)

| Run | SHA | UFs | Papel |
|---|---|---|---|
| [42267723718](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718) | `83bcb5ed` | AC,AP,BA,CE,DF,ES,MG,MS,MT,PB,PE,PR,RJ,RN,RO | 15 UFs |
| [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) | `a65997cc` | RR,RS,SC,SP | lote 4 isolado |

Catálogo versionado: `docs/qa-mapping/evidence/live-uf-runs.json`.

## Parâmetros após MA/TO live aprovado e credencial rotacionada

Input `ufs` vazio seleciona as 21 implementadas. CSV explícito também é válido:

```text
gh workflow run playwright-tests.yml --ref main -f mode=live-readonly -f suite=structural -f target=newfront -f ufs=AC,AP,BA,CE,DF,ES,MA,MG,MS,MT,PB,PE,PR,RJ,RN,RO,RR,RS,SC,SP,TO
```

`ci-select.mjs` confirma: vazio → 21 arquivos `*-estrutural.spec.ts` + `--grep @live-readonly`.

Critério esperado (somente após execução):

- 21 testes selecionados e executados
- 21 aprovados
- 0 falhas, 0 flaky, 0 skips, 0 retries
- Nenhuma persistência
- Nenhuma credencial em artifact

Não paralelizar Master (`workers=1`). Não usar retries para mascarar falha.
