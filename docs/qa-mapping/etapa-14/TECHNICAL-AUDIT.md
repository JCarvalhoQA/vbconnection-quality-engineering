# Etapa 14 — Auditoria técnica

**Evidência:** branch `feat/playwright-etapa-14-mutation-hardening` sobre `459138e` (merge PR #12). Inventário `docs/qa-mapping/etapa-5/LIVE-FIELD-INVENTORY.json`.

## O que mudou

| Peça | Papel |
|---|---|
| `mockContratoCadastroApis(..., { formSource: 'ui' })` | PAGE-02 estrutural mocked alimenta `/form/*` pelo inventário live |
| Registro persistente | Continua `java-or-ui` — matriz Java intocada |
| `CAMPO_POR_ID` complementares | Chaves reais do Angular (`INDICE_SIGLA`, `GRUPO_CONSORCIO`, `MORA_TAXA`, `MULTA_TAXA`, `VALOR_TAC`, `TOTAL_TAXA_ADMIN`) |
| Veículo ausente no inventário | Payload `[false, false]` para o Angular não pintar espécie extra |
| `assertCascaMockadaPorInventario` | Seções renderizáveis + `*` da casca mapeada + TG + Credor |
| `mockedOracleFindings` | Espelha as assertions acima; Documentos fora (sinal instável) |

## Diagnóstico

| Achado | Severidade | Prioridade | Classificação |
|---|---|---|---|
| 42 sobreviventes Etapa 13 = casca mocked sem `*` | Alta | P0 | Corrigido: assertion DOM + oráculo |
| Mapa `INDICE` ≠ `INDICE_SIGLA` | Alta | P0 | Corrigido; Angular ignorava o required |
| Documentos sem `/form` | Média | P2 | BA some, CE aparece — não assertado no mocked |
| `agenteFinanceiroCadastro` sem mapa | Baixa | P2 | Lacuna residual de casca |
| MA sem Java | — | — | Preservado; sem fixture inventada |

## Impacto

Mocked estrutural deixa de ser cego para asterisco de casca mapeada. Score de mutação 1,00 no catálogo válido.

## Recomendação

Manter duas fontes: UI para PAGE-02 mocked, Java para registro. Não copiar matriz Java da UI.

## Status

Factory única. Sem Page Object por UF. Live YAML intocado.

## Limitação

Mutation testing continua oráculo local. Score 1,00 ≠ homologação live 21/21.
