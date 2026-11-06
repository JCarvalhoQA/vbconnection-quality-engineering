# Etapa 8 — Auditoria técnica

**Data:** 2026-11-06  
**Baseline `main`:** `120714912c67441b31f29a57d12b797e69a8adf8` (merge PR #5)  
**Run de referência:** https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42225506247  
**Confirmação:** `origin/main` **é** a baseline. Nenhum commit posterior.

## Componentes confirmados

| Peça | Caminho |
|---|---|
| ContratoPage | `pages/contratoPage.ts` |
| VeiculoSection | `pages/fragments/veiculoSection.ts` |
| HomePage | `pages/homePage.ts` |
| LoginPage | `pages/loginPage.ts` |
| page02Structural | `support/page02Structural.ts` |
| page02LiveSession | `support/page02LiveSession.ts` |
| persistGuard | `support/persistGuard.ts` |
| ufUiProfile | `support/ufUiProfile.ts` |
| ngZorroField | `support/ngZorroField.ts` |
| Inventário live | `docs/qa-mapping/etapa-5/LIVE-FIELD-INVENTORY.json` |
| ci-select | `scripts/ci-select.mjs` |
| summarize | `scripts/summarize-e2e-results.mjs` |
| sanitize live | `scripts/sanitize-live-artifacts.mjs` |
| Workflow | `.github/workflows/playwright-tests.yml` |

## Inventário de testes (antes do lote 1)

- PAGE-02 estrutural mocked: BA, CE, RO (3).
- PAGE-02 estrutural live-readonly: BA, CE, RO (3), gated por `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1`.
- Registro persistente mocked: UFs em `DetranUf` (inclui AC/AP/DF/ES/SE; **não** inclui CE/RO/MA).
- Gates 0–3: inspeção live pontual, flags próprias.
- Unitários: 64 após esta etapa (63 na baseline + perfil lote 1).

## Locators e NG-ZORRO

- Date-picker: host `nz-date-picker#id` (id duplicado no input interno).
- Select: combobox + rótulo no `article` da seção.
- Veículo: `article` + heading Veículos; não usa IDs `*-veic-{timestamp}`.
- `VeiculoSection` ainda usa `.first()` em chassi/gravame (legado da linha expansível). Não expandido neste lote.

## Campos condicionais (inventário live)

- Zero km Sim → Não revela UF da placa, Placa, RENAVAM nas UFs do lote 1.
- Novo/usado **ausente** em AC, AP, DF, ES, CE, RO; **presente** em BA.
- Terceiro Garantidor visível em CE/ES/MA/PR/RJ; ausente em AC/AP/DF/BA/RO.

## Dependências e riscos

- Autenticação Master **não** isola sessão entre workers. Live permanece `workers=1`.
- persistGuard não cobre WebSocket, form nativo, outro BrowserContext, GET com efeito colateral.
- Credencial Master vazou em artifact do run 42220549160 (já excluído). **Rotação não confirmada** → bloqueio para novos disparos live nesta etapa.
- SE: `formularioDisponivel=false`. Não cobrir como formulário.
- MA: formulário live existe, matriz Java ausente. Fora do lote 1.

## CI (estado na baseline)

- `actions/checkout@v4`, `setup-node@v4` (Node 20), `upload-artifact@v4`, `ubuntu-latest`.
- Live: Environment `live-readonly`, `--workers=1 --retries=0`, sanitize, sem trace/vídeo no upload.
- PR executa mocked; live skipped.
