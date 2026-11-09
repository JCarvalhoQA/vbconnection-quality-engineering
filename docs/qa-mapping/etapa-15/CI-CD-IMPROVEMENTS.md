# Melhorias de CI/CD — Etapa 15

## Contrato preservado

| Evento | Mocked | Live |
|---|---|---|
| Pull Request | Executa | Skipped |
| Manual mocked | Executa | Skipped |
| Manual live-readonly | Skipped | Executa (só `main` + Environment) |

Live **não** é required check de merge nem de deploy corporativo.

## O que entrou nesta etapa

- `npm run quality:gates` no job mocked (após unit e após e2e) e no job live (após typecheck, sem Master)
- Upload de `quality-gates.json`, `quality-gates.md`, `uf-quality-indicators.json`
- Resumo e2e passa a anexar o Quality Gate Summary / matriz por UF
- Indicadores derivados (não hardcodados): IMPLEMENTED, MOCKED_PASSED, LIVE_PASSED, LIVE_PENDING, BLOCKED, NOT_APPLICABLE
- Catálogo histórico `docs/qa-mapping/evidence/live-uf-runs.json` com SHA e run IDs reais

## Sintaxe `ufs`

CSV (`MA,TO` ou as 21). Vazio = allowlist completa. Só com `suite=structural`. Live usa `--grep @live-readonly`.

## Comparação entre execuções

Ainda não há job de diff automático entre two runs. A comparação atual é documental (catálogo live + indicadores). Próximo passo opcional: script que lê dois `e2e-results.json` e lista regressões por UF — sem tornar live obrigatório.

## Duração

PAGE-02 mocked 21 UFs: ~56s local (6 workers). Regressão mocked completa: ~3.1 min. Live deve permanecer serial (`workers=1`); duração acumulada 21 UFs não foi medida nesta etapa (PENDING).
