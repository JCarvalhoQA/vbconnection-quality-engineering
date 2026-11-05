# Resultado E2-04..07 — mocks por UF

Data: 2026-11-05. Autorização: implementação controlada E2-04..07 (+ SE skip, persistGuard, sem CE/RO na suíte).

## O que foi feito

1. Gerador `auto.ui/playwright/scripts/generate-matriz-fixtures.mjs` lê `docs/qa-mapping/evidence/matriz-form.json`.
2. Fixtures em `auto.ui/playwright/fixtures/matriz/{UF}.json` (20 UFs Java) + `todas.json`.
3. `mockContratoCadastroApis` passa a responder GET `/api/form/**` com a fixture da UF.
4. Factory, fills e `validarCamposObrigatorios` obedecem visível / obrigatório / oculto.
5. `TIPO_CONTRATO` só é preenchido se visível; `INDICA_NOVO_USADO` só em BA; TG via `DADOS_TERCEIRO_GARANTIDOR`.
6. SE: `test.skip` com `formularioIndisponivel`.
7. CE/RO gerados (`naSuitePlaywright: false`); sem spec na suíte.
8. `persistGuard` aborta POST/PUT/PATCH/DELETE de persistência; `contratos/registrar` cai no mock.

## Divergências mock × Java (recalculadas)

Fonte: `docs/qa-mapping/evidence/mock-vs-java.json` após o gerador.

| Métrica | Antes | Depois |
|---|---|---|
| Células com status diferente | 515 | **0** |
| Células Java ausentes no mock | 1138 | **0** |
| Extra no mock | — | **0** |
| Overlap de payload | 18 UFs | 20 UFs (CE/RO como dado, fora da suíte) |
| Playwright only | SE | SE (skip) |

O mock de formulário **espelha a matriz Java**. Não afirma paridade com a Nova UX live.

## Testes executados (mocked, newfront SPA + API fake)

Estabilização 2026-11-05 — ver `ESTABILIZACAO-E2-04-07.md`.

- Unit: **51 passed**.
- E2E `@mocked` `e2e/contratos` + a11y + atalho: **44 passed**, **2 skipped** (só SE). DF registrar passou. gotoApp 5/5 na mesma bateria.
- Nenhum teste live. Nenhum POST real de negócio (persistGuard).

Relatórios: tag `@mocked` no describe + annotation `mode=mocked`.

## Divergências remanescentes (não são mock × Java)

- **POM × Nova UX:** campos obrigatórios extras (gravame, IOF, índice, complemento, e-mail credor, multa, valor parcela) foram preenchidos na PAGE-02 para o happy path continuar executável. Não é Page Object de aditivo/lote/imagem.
- **DF DATA_PAGAMENTO:** corrigido no mock (`fillNzDatePicker`); live não evidenciado.
- **CE/RO:** fixture existe; suíte espera destinos-combo live (E2-19).
- **Nova UX live:** sem evidência Master/DOM real. Fixtures = CONFIRMADO_CODIGO.
- Credor/TG profundos (E2-20) só o necessário para o mock fiel não quebrar o submit.

## Como regenerar

```powershell
cd auto.ui/playwright
npm run matriz:generate
npm run matriz:compare
```
