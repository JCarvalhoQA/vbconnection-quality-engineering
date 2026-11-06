# Plano de lotes estruturais

Implementação efetiva **somente do lote 1** nesta etapa. Lotes 2–5 e SE ficam documentados, sem specs novas.

| Lote | UFs | Objetivo | Estado |
|---|---|---|---|
| Baseline | BA, CE, RO | Regressão estrutural | Implementado + live CI 42225506247 |
| 1 | AC, AP, DF, ES | Validar factory compartilhada + TG misto | Specs mocked+live neste PR |
| 2 | MG, MS, MT, PB | Ampliar casca | Planejado |
| 3 | PE, PR, RJ, RN | Composições (TG em PR/RJ) | Planejado |
| 4 | RR, RS, SC, SP | Restante com matriz Java | Planejado |
| 5 | MA, TO | MA sem Java; TO WebPKI no registro | Planejado |
| Exceção | SE | Form indisponível | Investigar com nova evidência |

## Critérios para o lote seguinte

- Lote 1 merged em `main`.
- Live estrutural do lote 1 autorizado e executado (após rotação da credencial).
- Sem flaky novo na regressão mocked.
- Um PR por lote.

## Seleção CI

```text
suite=structural                 → BA,CE,RO,AC,AP,DF,ES
PLAYWRIGHT_UFS=BA,CE,RO          → baseline
PLAYWRIGHT_UFS=AC,AP,DF,ES       → lote 1
```

UFs fora da allowlist implementada (inclui SE e lote 2+) são rejeitadas. O filtro não aponta specs de registro.
