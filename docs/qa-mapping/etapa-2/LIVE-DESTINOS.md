# Gate 0 — GET destinos-combo (live)

**Status:** OBSERVADO  
**Data:** 2026-11-05  
**Endpoint:** `GET https://hmg.vbconnection.info/vbauto.api/api/.../destinos-combo`  
**Fonte:** payload sanitizado `docs/qa-mapping/evidence/live/destinos-combo.json`  
**Confiança:** CONFIRMADO

## UFs retornadas (22)

`AC AP BA CE DF ES MA MG MS MT PB PE PR RJ RN RO RR RS SC SE SP TO`

Campo SoT no payload: `codigoUf` (não `sigla`). `cpfCnpj` redigido no dump.

## Destaques vs suíte / Java (só leitura)

| UF | Live combo | Matriz Java (`matriz-form.json`) | Suíte Playwright `DetranUf` |
|---|---|---|---|
| BA | sim, id 14, `DETRAN-BA` | sim | sim |
| CE | sim, id 236 | sim (fora da suíte) | não |
| RO | sim, id 234 | sim (fora da suíte) | não |
| SE | sim, id 229, `DETRAN-SE` | **sem coluna** | spec skip `formularioIndisponivel` |
| MA | sim, id 238, `DETRAN-MA` | **ausente** | ausente |
| UN | não | Java tem UN | não |

Todos os itens do combo live vieram com `tipo: DETRAN` e `status: ATIVO`.

## Parser

A primeira passagem marcou `ufs: []` porque o extrator lia `sigla`/`uf`. Corrigido para `codigoUf`. BA **existe** no payload; o bloqueio da primeira passagem foi bug de parser, não ausência de BA.
