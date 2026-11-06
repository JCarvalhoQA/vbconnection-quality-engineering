# Plano live pós-merge — Lote 5

**Não executar nesta branch/PR.** Gate: merge + rotação comprovada + secret atualizado + aprovação humana.

Se `AUTH_PASSWORD_EXPIRED`: interromper; não alterar senha automaticamente.

## Isolado

```text
branch: main
mode: live-readonly
suite: structural
target: newfront
ufs: MA,TO
```

`playwright test --list`: **2 testes** `@live-readonly`. Sem registro persistente.

## Acumulado (depois do lote)

```text
ufs: AC,AP,BA,CE,DF,ES,MA,MG,MS,MT,PB,PE,PR,RJ,RN,RO,RR,RS,SC,SP,TO
```

`playwright test --list`: **21 testes**. Critério: 21 passed, 0 failed, 0 flaky, retries=0.

Não iniciar a Etapa 13 automaticamente.
