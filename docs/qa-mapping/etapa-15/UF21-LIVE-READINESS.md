# Prontidão da regressão live das 21 UFs

**Status:** `PENDING` — depende de MA/TO live aprovado **e** de `SECURITY_CLEARED`.

## Seleção validada (`--list`, sem executar)

```text
npx playwright test --project=vbconnection-newfront e2e/contratos/page02 --grep "@live-readonly" --list
```

Total: **21 tests in 4 files**. UFs: AC, AP, BA, CE, DF, ES, MA, MG, MS, MT, PB, PE, PR, RJ, RN, RO, RR, RS, SC, SP, TO.

`ci-select` com o CSV das 21 seleciona os mesmos arquivos. Input vazio também seleciona a allowlist completa.

## Parâmetros (não disparados)

```bash
gh workflow run playwright-tests.yml \
  --ref main \
  -f mode=live-readonly \
  -f suite=structural \
  -f target=newfront \
  -f ufs=AC,AP,BA,CE,DF,ES,MA,MG,MS,MT,PB,PE,PR,RJ,RN,RO,RR,RS,SC,SP,TO
```

Execução serial (`workers=1`, `retries=0`). Critério: 21 executed / 21 passed / 0 failed / 0 skipped / 0 flaky / 0 retries / zero persistência / zero credencial em artifact.

As 19 UFs históricas **não** contam como live do SHA `d4c4aa6`.
