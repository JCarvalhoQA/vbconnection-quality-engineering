# Regressão mocked — Etapa 12

## Lote 5

```text
npx playwright test --project=vbconnection-newfront
  e2e/contratos/page02/{ma,to}-estrutural.spec.ts --grep @mocked --retries=0
2 passed (10.4s)
```

## 19 UFs anteriores

```text
19 passed (36.1s)
0 failed / 0 flaky
```

## Completa

```text
npx playwright test --project=vbconnection-newfront --grep-invert @live-readonly --retries=0
103 tests using 6 workers
100 passed
3 skipped
0 failed
0 flaky
2.8m
```

Skipped conhecidos: 2× SE + 1 login recuperação 500.

PAGE-02 estrutural mocked: **21 passed**.

Typecheck: `tsc --noEmit` ok.  
Unitários: **77 passed**.  
`matriz:compare`: overlap=20 mismatch=0 (MA continua fora da matriz Java).
