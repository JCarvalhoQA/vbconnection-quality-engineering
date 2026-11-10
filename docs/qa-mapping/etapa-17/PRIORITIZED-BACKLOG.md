# Backlog priorizado — 15 negativos

Prioridade ≠ “ainda não tem teste”.

| ID | P | Critério | Bloqueio principal | Ordem sugerida |
|---|---|---|---|---:|
| CT-055 | **P0** | Integridade: operador sem permissão registrar | Oráculo NX do guard | 1 |
| CT-050 | **P1** | Dado de veículo incorreto no registro | Copy / min-max | 2 |
| CT-051 | **P1** | Documento inválido no registro | Copy / DV | 3 |
| CT-060 | **P1** | Duplicidade no órgão — alto impacto, alta dependência | Contrato API + política | 4 (só com contrato) |
| CT-070 | **P1** | Lote com nome inválido pode ir ao back | DOM NX PAGE-05 | 5 |
| CT-080 | **P1** | Upload MT acima do limite | DOM NX + número (3,5 vs 4 vs 12) | 6 |
| CT-064 | **P1** | Aditivo em protocolo fantasma | DOM + endpoint busca | 7 |
| CT-077 | **P1** | ZIP/limite imagem lote | DOM + role | 8 |
| CT-081 | **P2** | Limite SC (menor volume que MT divergente) | DOM NX | 9 |
| CT-082 | **P2** | Limite MS | DOM NX | 10 |
| CT-054 | **P2** | Timeout — CT-053 já cobre 500; VA-1585 incerto | Copy timeout | 11 |
| CT-061 | **P2** | Financeiro — regra inexistente | PO | 12 |
| CT-075 | **P2** | Aditivo lote — inferido | Paridade PAGE-05 | 13 |
| CT-072 | **P3** | 0 bytes — hipótese, baixo se accept já filtra | Regra | 14 |
| CT-073 | **P3** | Zip no lote contrato — hipótese | Accept | 15 |

## Liberados para automação agora

Nenhum. Próxima etapa de implementação só após resposta DEV/PO **ou** snapshot NX readonly (pós-rotação de credencial) para o Grupo B.

## Sequência de desbloqueio

1. Respostas CT-050/051/055 (PAGE-02, POM já existe).
2. Rotação Master → inspeção readonly PAGE-03/05/07/08 (sem POST).
3. POM + specs locais com arquivo sintético e persistGuard.
4. CT-060 somente com contrato de erro **sem** órgão real.
