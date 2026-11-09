# Mutation testing estrutural — Etapa 13

**Evidência:** `support/structuralMutation.ts`, `tests/structuralMutation.test.ts`. Clones em memória do perfil UI. Inventário versionado **não** é gravado (teste compara o arquivo antes/depois).

## Método

Mutação = alterar o **observado**. Esperado = perfil canônico. Detecção = oráculos que espelham mocked vs live.

Operadores: remover obrigatório, alterar `*`, remover/adicionar TG, Zero km, ocultar Placa/RENAVAM, remover Chassi/Gravame, remover seção, trocar UF.

## Resultado (21 UFs × 11 operadores × 2 suítes)

| Métrica | Valor |
|---|---|
| Detectadas | **378** |
| Sobreviventes | **42** |
| Inválidas (excluídas do denominador) | **42** |
| **Mutation score** | **378 / 420 = 0,90** |

Inválidas: `remove-tg` em UF sem TG (16×2) + `add-tg` em UF com TG (5×2) = 42. SE fora do conjunto das 21; se incluído, todas inválidas (`formulário indisponível`).

## Sobreviventes

As 42 sobreviventes são **somente mocked**:

- `alter-asterisk` × 21 UFs
- `remove-required-field` × 21 UFs (campo de casca, não veículo)

O live **não** deixa sobreviver: chassi, gravame, placa, RENAVAM, Zero km, add/remove TG.

## Impacto

Score 0,90 descreve a suíte combinada. O buraco real é o mocked não validar `*` da casca.

## Recomendação

Não inflar o score movendo o oráculo. Fortalecer mocked só com evidência de que o mock Angular expõe o asterisco.

## Status

Reproduzível: `npm run test:mutation` (também em `test:unit`). Expectativas numéricas fixas no teste.

## Limitação

Não muta Newfront. Não cobre GET com efeito colateral nem WebSocket.
