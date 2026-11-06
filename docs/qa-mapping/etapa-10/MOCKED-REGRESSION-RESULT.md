# Regressão mocked — Etapa 10

```text
npx playwright test --project=vbconnection-newfront --grep-invert @live-readonly --retries=0
97 tests using 6 workers
94 passed
3 skipped
0 failed
0 flaky
2.7m
```

Skipped conhecidos: 2× SE + 1 login recuperação 500.

PAGE-02 estrutural mocked: **15 passed**.

CI equivalente no PR #8: [run 42263506849](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42263506849) — Mocked SUCCESS; Live readonly SKIPPED. Typecheck, unitários e `matriz:compare` passaram no mesmo job.
