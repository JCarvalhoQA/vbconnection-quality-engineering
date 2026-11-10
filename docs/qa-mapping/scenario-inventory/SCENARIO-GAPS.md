# Lacunas: regra documentada × cenário × automação

Não cria cenário novo. Prioridade = risco de negócio × detecção atual. Hipótese (`RULE_NOT_CONFIRMED`) não vira requisito confirmado.

## P0 — bloqueia evidência live no SHA atual

| Funcionalidade | Regra identificada | Cenário existente | Automatizado | Lacuna | Prioridade |
|---|---|---|---|---|---|
| PAGE-02 live SHA atual | Casca das 21 UFs no HEAD | CT-029 | Código sim; run no HEAD não | MA/TO e regressão 21 sem evidência atual | **P0** |
| Credencial Master | Rotação após vazamento | CT-010 | Bloqueado | Impede qualquer live (também CT-023) | **P0** |

Sem live no SHA atual e sem Master regularizado, a suíte **não detecta regressão visual no newfront real** após o merge. Environment approval sozinho não fecha o incidente de credencial.

## P1 — buraco de detecção funcional (cenários já mapeados)

| Funcionalidade | Regra identificada | Cenário existente | Automatizado | Lacuna | Prioridade |
|---|---|---|---|---|---|
| PAGE-02 negativo chassi | Tamanho/duplicidade | CT-050, CT-060 | Não | Massa só gera 17 chars; DETRAN não é exercido | **P1** |
| PAGE-02 documento inválido | CPF/CNPJ | CT-051 | Não | Sem blur/submit negativo | **P1** |
| PAGE-02 5xx / timeout | Erro API / VA-1585 | CT-053, CT-054 | Não | Falso verde se HMG cair | **P1** |
| PAGE-02 permissão | CONTRATO_EDITAR | CT-055 | Não | Guard Nova UX não testado | **P1** |
| PAGE-02 Documentos | Heading estável | CT-036 | Só live | Mocked não detecta regressão de Documentos | **P1** |
| PAGE-03 aditivo | Busca protocolo / tipo por UF | CT-063–067 | Não | Tela sem POM NX | **P1** |
| PAGE-04 aditivo RS | Destino disabled | CT-068 | Não | Código v2; sem spec | **P1** |
| PAGE-05 lote | Nome de arquivo / não POST | CT-070–074 | Não | persistGuard ajuda; UI lote não | **P1** |
| PAGE-08 imagens por tela | Limites MT/SC/MS | CT-080–082 | Não | Risco de upload indevido se live | **P1** |

Automatizar P1 só depois de confirmar a regra na UI. CT-050/051/053/054/055/060 continuam `RULE_NOT_CONFIRMED` até evidência de produto.

## P2 — pendências, integração mapeada, fora do caminho crítico imediato

| Funcionalidade | Regra identificada | Cenário existente | Automatizado | Lacuna | Prioridade |
|---|---|---|---|---|---|
| PAGE-02 tipoEspecie | CE/PR/RJ além de MA | CT-038 | Parcial | Só MA tem extra explícito | **P2** |
| PAGE-06 aditivo lote | Processamento/erros | CT-075–076 | Não | NÃO_ANALISADO | **P2** |
| B3 | Etapa de envio | CT-057 | Não | Não há campo no form; não tratar botão como integração | **P2** |
| WebPKI | PR/RJ/TO | CT-056 | Não | Manual | **P2** |
| Recuperação 500 | Mensagem usuário inválido | CT-016 | fixme | Comportamento NX divergente do Vitest legado | **P2** |
| Valores financeiros | Consistência de campos | CT-061 | Não | RULE_NOT_CONFIRMED | **P2** |
| Data inválida | Datepicker / Enter | CT-052 | Não | Mapeado antigo; sem spec NX | **P2** |

## Fora desta suíte (política, não esquecimento)

| Funcionalidade | Cenário | Nota |
|---|---|---|
| PAGE-02 registro persistente / DETRAN | CT-058 | Bloqueado por política (não POST real). Risco de negócio alto, mas **não** é lacuna de spec a preencher neste repositório sem mudança de mandato. |
| Login certificado | CT-012 | Fora de escopo atual (**P3**). |

## Não é lacuna

- Assertions de `*` por campo dentro de CT-029 (são o mesmo cenário).
- Gates 0–3 vs specs estruturais (sobreposição histórica; specs por UF são a SoT atual).
- 40× novo/usado da matriz antiga: colapsado em CT-031/032; só BA tem a regra.
- SE sem formulário: CT-040 / CT-062 são Não aplicável — não inventar form.
