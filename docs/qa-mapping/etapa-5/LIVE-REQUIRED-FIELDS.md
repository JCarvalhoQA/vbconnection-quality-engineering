# Obrigatoriedade visual (`*`) — PAGE-02 live

**Classe:** LIVE_DOM  
**Não confundir com obrigatoriedade funcional** (submit) — essa permanece **BLOQUEADO**.

## Núcleo compartilhado (21 UFs com form)

Estes `*` apareceram em **todas** as UFs que carregaram o cadastro:

| Seção | Label live |
|---|---|
| Destino | Destino* |
| Agente financeiro | Agente financeiro* |
| Agente financeiro | CNPJ* |
| Contrato | Número do Contrato* |
| Devedor | CPF / CNPJ* |
| Devedor | Nome completo* |
| Devedor | UF* |
| Devedor | Cidade* |

Tipo de restrição, datas, valor total e índice **não** entram neste núcleo: várias UFs os exibem sem `*` (ex.: RO).

## Extremos

| UF | `*` casca | Leitura |
|---|---|---|
| RO | 11 | só núcleo + tipo restrição + UF/cidade liberação |
| MT | 17 | form curto |
| TO | 16 | form curto |
| RN | **30** | mais rígido visualmente |
| MS | 27 | rígido; Cypress HMG “não contratado” |
| SP | 26 | acima da mediana |
| BA | 23 | Gate 1 |
| CE / MA | 25 | clone um do outro |

## Regras específicas (visual)

| Campo | Onde tem `*` | Onde aparece sem `*` / ausente |
|---|---|---|
| Novo / usado | **só BA** | ausente nas outras 20 com form |
| Ano fabricação (veículo) | AC AP CE MA MG MS PB PE PR RJ RN RR SC SP + CE clone | BA ausente; DF ES MT RO RS TO visível sem `*` |
| Gravame | maioria `*` | ES e RS visível sem `*` |
| Índice | BA `*` | CE/MA/RO e várias sem `*` |
| Celular devedor | CE/MA `*` | BA/RO ausente ou telefone só |
| Data/época/local pagamento | CE/MA `*` | RO/BA ausentes |
| Taxa juros mês | CE/MA `*` | RO opcional |
| Cor veículo | RJ `*` | outras: opcional ou ausente |
| Situação do chassi | vários `*` (AC AP MG…) | CE/MA/ES/RS/TO opcional ou BA ausente |

## Funcional (não medida)

Blur/submit para mensagens “Campo obrigatório” e rejeição do Registrar: **BLOQUEADO** em 21 UFs.  
Único blur documentado: Gate 1 BA (Número do Contrato vazio) — copy exato PENDENTE.
