# Regressão mocked — Etapa 9

```text
npx playwright test --project=vbconnection-newfront --grep-invert @live-readonly --retries=0
93 tests using 6 workers
90 passed
3 skipped
0 failed
0 flaky
2.6m
```

Skipped conhecidos: 2× SE (sem formulário) + 1 login recuperação 500.

PAGE-02 estrutural mocked: **11 passed** (baseline + lote 1 + lote 2).

Os +4 em relação à etapa 8 (89 → 93) são MG, MS, MT e PB estruturais mocked.
