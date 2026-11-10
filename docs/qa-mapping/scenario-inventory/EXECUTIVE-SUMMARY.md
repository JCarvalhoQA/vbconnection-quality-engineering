# Inventário de cenários — resumo executivo

**SHA da `main`:** `60afe1163606a4cb42d18d6bfbf0e1720585ba82` (2026-11-10)
**Método:** cenário lógico canônico ≠ instância por UF ≠ `test()` ≠ execução. Assertions isoladas não entram na conta.

Os **83** IDs `CT-001`–`CT-083` são cenários lógicos canônicos. Não são instâncias de execução (21 UFs × casca) nem assertions individuais (`*` por campo, `expectNovoUsado`, etc.).

## 1. Total de cenários

| Métrica | Qtd |
|---|---:|
| Cenários lógicos únicos | **83** |
| IDs | CT-001 … CT-083 |
| Duplicidades | 0 |
| Polaridade N/A (sem positivo/negativo) | 3 |

## 2. Distribuição por funcionalidade

| Área | IDs | Qtd |
|---|---|---:|
| PAGE-01 Login | CT-001–CT-018 | 18 |
| PAGE-HOME (Home) | CT-019–CT-023 | 5 |
| Consulta / Clientes / Telas padrão | CT-024–CT-026 | 3 |
| PAGE-02 A11y / estabilidade | CT-027–CT-028 | 2 |
| PAGE-02 Estrutural | CT-029–CT-044 | 16 |
| PAGE-02 Funcional / integração | CT-045–CT-062 | 18 |
| PAGE-03 Aditivo | CT-063–CT-067 | 5 |
| PAGE-04 Aditivo RS | CT-068–CT-069 | 2 |
| PAGE-05 Lote | CT-070–CT-074 | 5 |
| PAGE-06 Aditivo lote | CT-075–CT-076 | 2 |
| PAGE-07 Imagem lote | CT-077 | 1 |
| PAGE-08 Imagem por tela | CT-078–CT-083 | 6 |
| **Total** | | **83** |

No repositório, **PAGE-08** é *imagem por tela* (`docs/qa-mapping/pages/imagem-tela.md`). A Home do enunciado legado foi catalogada como **PAGE-HOME**, para não colidir com PAGE-08.

No CSV, Consulta / Clientes / Telas padrão aparecem como `PAGE-CONSULTA`, `PAGE-CLIENTES` e `PAGE-PADRAO` (3 linhas). PAGE-02 soma 36 lógicos (2 + 16 + 18).

## 3. Distribuição por status de automação (mutuamente exclusiva)

| Status | Qtd | Comentário |
|---|---:|---|
| Automatizado | 40 | Existe `test()` / helper que exerce a intenção |
| Parcialmente automatizado | 4 | CT-036 Documentos; CT-038 tipoEspecie; CT-048 PR; CT-049 PB |
| Apenas mapeado | 32 | Docs/Gherkin/código v2, sem spec NX da intenção |
| Bloqueado | 4 | CT-010, CT-016, CT-023, CT-058 |
| Não aplicável | 3 | CT-040, CT-059, CT-062 |
| **Total** | **83** | 40 + 4 + 32 + 4 + 3 |

O levantamento anterior somou só as três primeiras faixas (**40 + 4 + 32 = 76**). Os **sete** restantes já estavam classificados: **não** são “pendentes”.

Status de automação **não** se mistura com polaridade (positivo/negativo) nem com tipo (estrutural/funcional). Implementação ≠ execução: gates live CT-041–CT-044 são Automatizado no código e `NOT_VERIFIED` no SHA atual.

## 4. Positivos e negativos

| Polaridade | Qtd |
|---|---:|
| Positivo | 55 |
| Negativo | 25 |
| Sem polaridade (`—`) | 3 (CT-040, CT-059, CT-062) |
| **Total** | **83** |

Negativos em status exclusivo: 7 Automatizado + 1 Bloqueado (`test.fixme` CT-016) + 17 Apenas mapeado = 25. A leitura “8 com alguma automação + 1 fixme + 17 mapeados” **sobreõe** CT-016 e não deve ser somada (ver `NEGATIVE-SCENARIOS.md`).

## 5. Cobertura por UF

| Recorte | Resultado |
|---|---|
| Specs estruturais PAGE-02 | 21 UFs (AC AP BA CE DF ES MA MG MS MT PB PE PR RJ RN RO RR RS SC SP TO) |
| Testes mocked estruturais | 21/21 |
| Registro funcional mocked | 18 UFs (`DetranUf`; sem CE, RO, MA) |
| SE | Sem formulário (CT-040 N/A; CT-062 skip) |
| Particularidades | TG: CE ES MA PR RJ · Novo/usado: BA · tipoEspecie: CE MA PR RJ |

Não generalizar TG, novo/usado ou tipoEspecie para as 21 UFs.

## 6. Evidências mocked

Último CI mocked comprovado: [42635151327](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42635151327) (`ae18d2c`, ancestral de `60afe11`, success).

Cobre os 40 automatizados e os 4 parciais no job `--grep-invert @live-readonly`. Aprovação mocked **não** é homologação DETRAN/B3.

## 7. Evidências live

| Camada | Estado |
|---|---|
| Live no SHA `60afe11` | **0** |
| Live histórico estrutural | 19 UFs — runs [42267723718](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718) (15 UFs, `83bcb5ed`) e [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) (lote 4 RR/RS/SC/SP, `a65997cc`) |
| MA / TO live | `MA_TO_LIVE_PENDING` — sem run comprovado |
| 21/21 live | **Não declarar** |

Live histórico **não** cobre o SHA atual. Código live (21 specs + gates 0–3) ≠ evidência de execução.

## 8. Lacunas críticas (P0)

1. Evidência live das 21 UFs no SHA atual.
2. Regularização da credencial Master (`BLOCKED_SECURITY_CREDENTIAL_ROTATION`) — bloqueia CT-010, CT-023 e qualquer live.

Registro persistente / DETRAN (CT-058) permanece **bloqueado por política da suíte**, não por esquecimento de spec. Detalhe em `SCENARIO-GAPS.md`.

## 9. Limitações deste inventário

- Catálogo lógico; não substitui relatório de execução.
- Mocked verde ≠ órgão de trânsito / B3.
- Matriz antiga `SCN-*` é alias, não ID canônico.
- Hipóteses (`RULE_NOT_CONFIRMED`) entram como mapeadas, não como requisito confirmado.
- Documentos mocked instáveis: CT-036 só afirma Documentos em live.
- tipoEspecie: inventário CE/MA/PR/RJ; assertion extra explícita só em MA (CT-038 parcial).
- Publicação documental: nenhum teste novo, nenhum run live, nenhum merge.

## 10. Recomendações de evolução

1. Rotacionar a credencial Master **antes** de qualquer live no HEAD.
2. Reexecutar estrutural live 21 UFs na `main` após a rotação; registrar MA/TO.
3. Automatizar negativos de contrato P1 (chassi, documento, data, 5xx, timeout) **depois** de confirmar a regra na UI — não promover `RULE_NOT_CONFIRMED` a spec.
4. Cobrir PAGE-03…08 quando houver POM NX; até lá permanecem mapeados.
5. Manter este CSV como SoT de IDs; novos cenários recebem `CT-084+`, sem reaproveitar IDs.

## Reconciliação dos sete (evidência)

Não foram classificados como “pendentes”. Status no CSV:

| ID | Status | Por quê |
|---|---|---|
| CT-010 | Bloqueado | Login Master live — `BLOCKED_SECURITY_CREDENTIAL_ROTATION` |
| CT-016 | Bloqueado | `test.fixme` recuperação 500 (UI newfront não atualiza) |
| CT-023 | Bloqueado | Menus/home Master — depende de CT-010 |
| CT-058 | Bloqueado | Registro persistente live / DETRAN — proibido nesta suíte |
| CT-040 | Não aplicável | SE sem formulário PAGE-02 (`formularioIndisponivel`) |
| CT-059 | Não aplicável | CE/RO/MA fora de `DetranUf` (registro); estrutural existe |
| CT-062 | Não aplicável | SE registro — `test.skip` sem form |

## Colisão de numeração

**PAGE-08** = imagem por tela. **PAGE-HOME** = Home. Não reatribuir PAGE-08 à Home.
