# Plano live pós-merge

Gate original: merge + rotação comprovada da senha Master + secret atualizado + aprovação humana.

O lote 3 isolado (`ufs=PE,PR,RJ,RN`) **não** foi disparado à parte. Em 2026-11-06T18:06:50Z, `JCarvalhoQA` disparou `workflow_dispatch` na `main` @ `83bcb5e` com `PLAYWRIGHT_UFS` vazio, o que selecionou as **15** UFs estruturais (lote 3 + regressão acumulada).

## Executado

```text
run: 42267723718
branch: main
commit: 83bcb5ed0fdf42d5cebf87682925999d3c1dd62f
mode: live-readonly
suite: structural
target: newfront
ufs solicitadas: (vazio)
ufs selecionadas/executadas/aprovadas: AC,AP,BA,CE,DF,ES,MG,MS,MT,PB,PE,PR,RJ,RN,RO
total: 15 passed / 0 failed / 0 flaky / 0 skipped
duração: 4m 50s
workers: 1
retries: 0
```

https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718

Persistência: `persistGuard` live-readonly (mutações `/api/` abortadas; limites: WS, form nativo, outro context).

## Ainda bloqueado (rotação)

Sucesso live **não** comprova rotação da senha Master. Ver `LIVE-SECURITY-AUDIT.md`.

Não tratar mocked como live. Não iniciar o Lote 4 neste ciclo.
