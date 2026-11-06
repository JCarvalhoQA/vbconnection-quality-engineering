# Regressão mocked — Etapa 8

```text
npx playwright test --project=vbconnection-newfront --grep-invert @live-readonly --retries=0
89 tests using 6 workers
86 passed
3 skipped
0 failed
0 flaky
2.3m
```

Skipped conhecidos: 2× SE (sem formulário) + 1 login recuperação 500.

Os +4 em relação à regressão da etapa 7 (85 contabilizados → 89) são os estruturais mocked AC, AP, DF e ES.

BA/CE/RO estruturais mocked permaneceram verdes.
