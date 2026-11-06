# Regressão mocked — Etapa 11

## Lote 4

```text
npx playwright test --project=vbconnection-newfront
  e2e/contratos/page02/{rr,rs,sc,sp}-estrutural.spec.ts --grep @mocked --retries=0
4 passed (12.6s)
0 failed / 0 flaky
```

## Baseline 15 UFs

```text
15 passed (28.6s)
0 failed / 0 flaky
```

## Completa

```text
npx playwright test --project=vbconnection-newfront --grep-invert @live-readonly --retries=0
101 tests using 6 workers
98 passed
3 skipped
0 failed
0 flaky
2.8m
```

Skipped conhecidos: 2× SE + 1 login recuperação 500.

PAGE-02 estrutural mocked: **19 passed**.

Typecheck: `tsc --noEmit` exit 0.  
Unitários: **73 passed** (3.3s).  
`matriz:compare`: overlap=20 mismatch=0.
