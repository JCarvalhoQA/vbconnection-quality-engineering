# Plano live pós-merge — Lote 4

**Não executar nesta branch/PR.** Gate: merge na `main` + rotação comprovada da senha Master + secret atualizado + aprovação humana no Environment `live-readonly`.

Se a política de expiração estiver ativa ou `AUTH_PASSWORD_EXPIRED` ocorrer: interromper, não alterar senha automaticamente, atualizar o secret após troca autorizada.

## Lote 4 isolado

```text
branch: main
mode: live-readonly
suite: structural
target: newfront
ufs: RR,RS,SC,SP
```

`playwright test --list` desta seleção: **4 testes** `@live-readonly`.

Esperado: 4 passed, retries=0, persistência bloqueada.

## Regressão acumulada (depois do lote)

```text
mode: live-readonly
suite: structural
target: newfront
ufs: AC,AP,BA,CE,DF,ES,MG,MS,MT,PB,PE,PR,RJ,RN,RO,RR,RS,SC,SP
```

`playwright test --list`: **19 testes**. Não tratar mocked como live. Não iniciar o Lote 5 automaticamente.
