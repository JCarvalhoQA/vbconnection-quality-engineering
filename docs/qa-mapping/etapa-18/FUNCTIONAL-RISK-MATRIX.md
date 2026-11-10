# Matriz de risco funcional — contrato e imagem

Prioridade ≠ quantidade de testes. Critérios: impacto no registro, órgão, dados, frequência, cobertura, detectabilidade.

| Tema | Impacto | Prob. | Cobertura antes | P | Ordem | Decisão etapa 18 |
|---|---|---|---|---|---:|---|
| Registro feliz POST + UI | financeiro / operacional | alta | 18 UFs sem assert de payload | **P0** | 1 | CT-047 payload BA |
| HTTP registrar 4xx/5xx | recuperação / falso sucesso | média | só 500 | **P0** | 2 | CT-053 +400 +503 |
| Gravame >8 | rejeição órgão / dado inválido | média | 0 | **P1** | 3 | CT-084 |
| Parcelas/valor negativo | dado financeiro | média | 0 (CT-061 genérico) | **P1** | 4 | CT-085, CT-086 |
| Upload imagem | operacional / DETRAN | alta | 0 NX | **P0** | — | **bloqueado**: tela não monta |
| B3 | órgão | alta | 0 | **P0** | — | persistGuard; sem POST |
| Chassi ≠17 / duplicado | órgão | média | RULE_NOT_CONFIRMED | **P1** | — | não automatizar |
| CPF inválido | dado | média | RULE_NOT_CONFIRMED | **P1** | — | não automatizar |
| Timeout DETRAN | disponibilidade | baixa | VA-1585 incerto | **P2** | — | não inventar copy |
| Datas parcela | dado | média | copy ausente | **P2** | — | não automatizar |
| Lote contrato/aditivo | operacional | média | DOM NX ausente | **P2** | — | posterior |

Não se atribuiu P0 a CT-084 só por estar sem teste: o truncamento já impede o nono dígito.
