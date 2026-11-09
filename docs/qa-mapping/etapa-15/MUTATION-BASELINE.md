# Mutation baseline — Etapa 15

**Comando:** `npm run test:mutation` (também em `npm run test:unit`).  
**Código:** `support/structuralMutation.ts`. Clones em memória; inventário versionado não é gravado.

## Resultado reproduzido (2026-11-09)

| Métrica | Valor |
|---|---|
| Detectadas | 420 |
| Sobreviventes | 0 |
| Erros | 0 |
| Inválidas (fora do denominador) | 42 |
| Mutation score | 420 / 420 = **1.00** |

Catálogo: 21 UFs × 11 operadores × 2 suítes. Inválidas: `remove-tg` em UF sem TG (16×2) + `add-tg` em UF com TG (5×2) = 42. SE fora do denominador (`formulário indisponível`).

Nenhuma mutação sobrevivente nova em relação à Etapa 14. Score 1.00 descreve o **catálogo atual**, não paridade live nem 21/21 live.

Gate 5 exige que o teste continue afirmando 420 / 0 / 42 / score 1. Novos operadores só entram com assertion Playwright correspondente.
