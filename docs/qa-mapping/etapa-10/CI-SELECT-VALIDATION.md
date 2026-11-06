# Seleção CI — lote 3

```text
mode=mocked suite=structural ufs=PE,PR,RJ,RN
→ pe|pr|rj|rn-estrutural.spec.ts --grep @mocked
lote=batch-03
sem registro/*.spec.ts
```

```text
mode=live-readonly suite=structural
ufs=AC,AP,BA,CE,DF,ES,MG,MS,MT,PB,PE,PR,RJ,RN,RO
lote=baseline + batch-01 + batch-02 + batch-03
```

`playwright test --list` live PAGE-02: **15 testes**. Lote 3 isolado: **4 testes**.
SE e `ufs` em regression continuam rejeitados.
