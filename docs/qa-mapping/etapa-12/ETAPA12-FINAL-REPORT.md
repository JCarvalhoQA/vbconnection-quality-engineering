# Etapa 12 — Relatório final (lote 5)

Cobertura estrutural PAGE-02 elevada de 19 para **21 UFs** (MA, TO). SE permanece exceção (formulário indisponível). Mocked aprovado. Live de MA/TO **não executado**. Credencial: `BLOCKED_SECURITY_CREDENTIAL_ROTATION`.

MA permanece **sem matriz Java**. Mock de `/form/*` usa inventário live (`support/uiFormMock.ts`). Fixture `fixtures/matriz/MA.json` **não foi criada**.

Baseline live lote 4: [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) = **4/4** (RR, RS, SC, SP), não 19/19.

## Distinção de cobertura

| Classe | Significado | Estado nesta etapa |
|---|---|---|
| Implementada | Spec factory + perfil UI + seleção CI | 21 UFs (MA, TO incluídas) |
| Mocked aprovada | Playwright `@mocked` verde | 21/21 PAGE-02 estrutural |
| Live aprovada | Workflow `live-readonly` na `main` | 15 (42267723718) + lote 4 isolado 4 (42281730173). MA/TO pendente |
| Bloqueada | Gate de segurança ou senha | Live MA/TO bloqueado até rotação comprovada |
| Formulário indisponível | Sem PAGE-02 no destino | SE |

## Resumo

| Item | Evidência |
|---|---|
| Implementado | Specs mocked + live-readonly MA, TO via factory |
| Mocked lote 5 | 2 passed (10.4s) |
| Mocked baseline 19 | 19 passed (36.1s) |
| Mocked completo | 100 passed / 3 skipped / 0 failed / 0 flaky (2.8m) |
| Unitários | 77 passed |
| Typecheck | `tsc --noEmit` ok |
| Matriz Java | overlap=20 mismatch=0 (MA fora da matriz; TO presente) |
| Live --list lote 5 | 2 testes `@live-readonly` (MA, TO) |
| Live --list 21 UFs | 21 testes; sem registro persistente |
| Live executado | **Não** |
| Lote / Etapa 13 | **Não iniciado** |

## Branch

`feat/playwright-uf-batch-05-ma-to`
