# Plano live pós-merge

**Não executar nesta branch/PR.** Gate: merge + rotação comprovada da senha Master + secret atualizado + aprovação humana.

```text
mode=live-readonly suite=structural target=newfront ufs=PE,PR,RJ,RN
```

Esperado: 4 passed, retries=0, persistência bloqueada.

Depois, acumulado das 15 UFs com o mesmo gate. Não tratar mocked como live.
