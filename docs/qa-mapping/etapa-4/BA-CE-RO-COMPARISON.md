# Comparação estrutural PAGE-02 — BA × CE × RO

**Status:** CONFIRMADA_LIVE (Gate 1 BA + Gate 2 CE/RO)  
**Data:** 2026-11-05

## Matriz pedida

| Elemento | BA | CE | RO |
|---|---|---|---|
| Novo/usado | Confirmado: combobox **obrigatório** (`indicaNovoUsado`) | **Ausente** | **Ausente** |
| Zero km | Confirmado: combobox, default **Sim**, opções Sim/Não | Confirmado: igual | Confirmado: igual |
| UF placa | Condicional (zero km = Não), sem `*` | Condicional, sem `*` | Condicional, sem `*` |
| RENAVAM | Condicional (zero km = Não), sem `*` | Condicional, sem `*` | Condicional, sem `*` |
| Placa | Condicional (zero km = Não) | Condicional | Condicional |
| Terceiro Garantidor | Não identificado | **Presente**, 12 campos, 0 `*` | Não identificado |
| Documentos | Presente (dropzone) | Presente (dropzone) | Presente (dropzone) |
| Credor | Presente, sem `*` | Presente, sem `*` (+ e-mail) | Presente, sem `*` (+ e-mail) |

## Casca

| Tema | BA | CE | RO |
|---|---|---|---|
| Campos DOM | 47 | 68 | 52 |
| `*` visuais | 23 | 25 | 11 |
| Código DETRAN agente | ausente | opcional | opcional |
| Tipo de Contrato | ausente | opcional | opcional |
| Índice | `*` | opcional | opcional |
| Data pagamento / época / UF+cidade pagamento | ausentes | os quatro `*` | ausentes |
| Data assinatura | ausente | ausente | opcional |
| E-mail contrato | opcional | ausente | opcional |
| Celular devedor | ausente | `*` | ausente |
| E-mail devedor | ausente | opcional | opcional |
| Número endereço devedor | `*` | opcional | opcional |
| CEP/logradouro/bairro devedor | `*` | `*` | opcional |
| Valor TAC | ausente | ausente | opcional |
| Taxa multa / taxa admin / taxa contrato | mora+multa+admin(+taxa contrato) | mora+multa+admin | só mora |
| TG heading | não | sim | não |

## Veículo (linha inline — as três)

| Tema | BA | CE | RO |
|---|---|---|---|
| UI | linha, não modal | igual | igual |
| Cancelar | ausente | ausente | ausente |
| Excluir / Salvar | Excluir descarta; Salvar não clicado | igual | igual |
| Chassi\* / Gravame\* | sim | sim | sim |
| Número motor | opcional | ausente | ausente |
| Ano fabricação | ausente | **`*`** | opcional |
| Ano modelo | ausente | opcional | opcional |
| Situação do chassi | ausente | opcional | ausente |
| Tipo espécie / Marca modelo | ausentes | opcionais | ausentes |
| Novo/usado muda campos | não | n/a (ausente) | n/a |

## Obrigatoriedade — diferenças que quebram massa única

Uma massa “feliz” BA **não** serve para CE nem RO:

- CE exige Taxa juros mês, Data/Época pagamento, UF/cidade pagamento, Celular, Ano fabricação (`*`).
- RO **não** exige Data contrato, parcelas, valor total, vencimentos, endereço completo, telefone, índice.
- Só BA exige Novo/usado.
- As três exigem tratar zero km: default Sim esconde placa; usado/emplacado precisa Não.

## Confiança

Tudo nesta tabela: CONFIRMADA_LIVE. Java/mock na coluna de [LIVE-VS-JAVA-VS-MOCK.md](./LIVE-VS-JAVA-VS-MOCK.md).
