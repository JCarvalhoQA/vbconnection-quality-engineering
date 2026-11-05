# SE — Sergipe

**Não existe** no enum Java `serasa.data.administracao.fornecedor.model.DETRAN`. A matriz de formulário **não** tem coluna SE.

O Playwright inclui SE com **ID sintético 27** (`detransIds.ts`: “SE não possui enum no produto”).

| Tema | Status |
|---|---|
| Combo Destino no HMG real | **NÃO_ANALISADO** / possível ausência |
| GET `/api/form/detran/{id}` | risco de NPE/`fromUf` nulo — **INFERIDO** |
| Testes mockados | wrappers `se.spec.ts` existem |
| Pedido original | listava SE |

Classificação: **BLOQUEADO** para regra de negócio real; **CONFIRMADO_TESTE** apenas no mock.
