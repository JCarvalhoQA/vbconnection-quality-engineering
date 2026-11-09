# Mutation testing estrutural — Etapa 14

**Evidência:** `support/structuralMutation.ts`, `tests/structuralMutation.test.ts`, `npm run test:mutation`. Clones em memória. Inventário versionado **não** é gravado.

## Método

O oráculo mocked passou a espelhar `assertCascaMockadaPorInventario`: headings renderizáveis via `/form`, campos de casca mapeados, `*` visual, TG, Credor, linha de veículo.

Operadores inalterados. Catálogo de `alter-asterisk` / `remove-required-field` agora escolhe campo obrigatório de **casca mapeada** (`camposCascaAssertaveis`), o mesmo conjunto que o Playwright itera.

Não houve “game” do oráculo: a detecção só subiu depois das assertions reais no DOM (canário BA: `*` de casca visível com `formSource: 'ui'`).

## Resultado (21 UFs × 11 operadores × 2 suítes)

| Métrica | Etapa 13 | Etapa 14 |
|---|---|---|
| Detectadas | 378 | **420** |
| Sobreviventes | 42 | **0** |
| Erros | — | **0** |
| Inválidas (fora do denominador) | 42 | **42** |
| **Mutation score** | 0,90 | **420 / 420 = 1,00** |

Inválidas: `remove-tg` em UF sem TG (16×2) + `add-tg` em UF com TG (5×2) = 42. SE fora das 21; se incluído, todas inválidas (`formulário indisponível`). Erro não inflaciona o score.

## Sobreviventes

Nenhuma no catálogo válido. As 42 da Etapa 13 (`alter-asterisk` mocked × 21 e `remove-required-field` mocked × 21) agora saem `detected`.

## Impacto

Score 1,00 descreve o catálogo atual. Não significa paridade live nem 21/21 live.

## Recomendação

Novos operadores só entram se houver assertion Playwright correspondente.

## Status

Reproduzível: `npm run test:mutation`. Expectativas numéricas fixas no teste (420 / 0 / 42 / 0 / 1).

## Limitação

Não muta Newfront. Não cobre Documentos, `agenteFinanceiroCadastro` nem GET com efeito colateral.
