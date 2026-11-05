# Status das 22 UFs do destinos-combo live

**Status:** CLASSIFICADO POR EVIDÊNCIA  
**Data:** 2026-11-05  
**Fonte live:** `GET destinos-combo` · `codigoUf` · todos `tipo: DETRAN` · `status: ATIVO`  
**Regra:** presença no combo **não** confirma suporte funcional do formulário.

IDs abaixo são os retornados no combo HMG (não usar ID sintético 27 para SE).

## Legenda

| Coluna | Sim significa |
|---|---|
| Combo live | item ATIVO no destinos-combo |
| Matriz Java | coluna em `MatrizDados*` / fixture `fixtures/matriz/{UF}.json` |
| Suíte Playwright | tipo `DetranUf` + spec `e2e/contratos/registro/{uf}.spec.ts` |
| Formulário PAGE-02 | seções do cadastro observadas **nesta UF** no newfront |
| Decisão de produto | há lacuna que automação não pode fechar sozinha |

## Matriz das 22

| UF | id combo | Combo live | Matriz Java | Suíte Playwright | Formulário PAGE-02 | Decisão de produto |
|---|---|---|---|---|---|---|
| AC | 17 | sim | sim | sim | **não inspecionado** | não (aguardar gate por UF) |
| AP | 225 | sim | sim | sim | não inspecionado | não |
| BA | 14 | sim | sim | sim | **sim (Gate 1)** | ver decisões de paridade em [RISKS-AND-BLOCKERS.md](./RISKS-AND-BLOCKERS.md) |
| CE | 236 | sim | sim (`naSuitePlaywright: false`) | **não** | não inspecionado | **sim** — incluir suíte / inspecionar form / priorizar |
| DF | 232 | sim | sim | sim | não inspecionado | não |
| ES | 230 | sim | sim | sim | não inspecionado | não |
| MA | 238 | sim | **não** (sem coluna, sem fixture) | **não** | não inspecionado | **sim** — ver seção MA |
| MG | 9 | sim | sim | sim | não inspecionado | não |
| MS | 226 | sim | sim | sim (mock **não** aplica `servicoNaoContratado`) | não inspecionado | sim (HMG Cypress ignora MS; live combo ATIVO) |
| MT | 233 | sim | sim | sim | não inspecionado | não |
| PB | 13 | sim | sim | sim | não inspecionado | não |
| PE | 3 | sim | sim | sim | não inspecionado | não |
| PR | 10 | sim | sim | sim (`requerWebPki`) | não inspecionado | certificado fora de escopo |
| RJ | 16 | sim | sim | sim (`requerWebPki`) | não inspecionado | certificado fora de escopo |
| RN | 228 | sim | sim | sim | não inspecionado | não |
| RO | 234 | sim | sim (`naSuitePlaywright: false`) | **não** | não inspecionado | **sim** — ver seção RO |
| RR | 11 | sim | sim | sim | não inspecionado | não |
| RS | 231 | sim | sim | sim | não inspecionado | não |
| SC | 4 | sim | sim | sim | não inspecionado | não |
| SE | 229 | sim | **não** | spec com `formularioIndisponivel` | não inspecionado | **sim** — ver seção SE |
| SP | 1 | sim | sim | sim | não inspecionado | não |
| TO | 122 | sim | sim | sim (`requerWebPki`) | não inspecionado | certificado fora de escopo |

**Não estão no combo live:** UN (enum Java `UNIFICADO`, sem coluna de form). AL, AM, GO, PA, PI e demais UFs do Brasil.

## Conjuntos

| Conjunto | UFs | Uso |
|---|---|---|
| Live ∩ Java ∩ Playwright | 18: AC AP BA DF ES MG MS MT PB PE PR RJ RN RR RS SC SP TO | únicas com as três fontes; só BA tem form live |
| Live ∩ Java, fora da suíte | CE, RO | backend mapeado; combo real; **não automatizar** até inspeção de form |
| Live, fora da Java e da suíte | MA | combo ATIVO sem regras de campo |
| Live + spec skip, fora da Java | SE | combo ATIVO vs “formulário indisponível” |
| Java enum sem combo | UN | fora de registro por UF |

Pedido original da auditoria (19) **não** inclui CE/RO e **inclui** SE. O combo live **inclui** CE, RO, MA e SE.

## MA — lacunas e recomendações

| Fonte | Evidência |
|---|---|
| Combo live | `DETRAN-MA` id **238** ATIVO |
| `DETRAN` / `MatrizDados*` | **ausente** |
| Fixture `MA.json` | **não existe** |
| `DetranUf` / spec | **ausente** |
| PAGE-02 MA | **não aberto** (proibido nesta gate) |

Recomendações (escolher uma; não executar nesta gate):

1. Produto: MA **não** é destino de cadastro → retirar ou inativar no destinos-combo.
2. Produto: MA **é** destino → criar coluna Java + fixture; só então inspecionar PAGE-02 em modo leitura.
3. Automação: **não** gerar spec, mock de form nem massa MA até (1) ou (2).

Não registrar contrato MA. Não inferir campos a partir da BA.

## SE — lacunas e recomendações

| Fonte | Evidência |
|---|---|
| Combo live | `DETRAN-SE` id **229** ATIVO (não usar 27) |
| Enum/matriz Java | **sem** constante SE e **sem** coluna |
| `detransIgnorados.json` | `formularioIndisponivel: DETRAN-SE` |
| Playwright | `se.spec.ts` skip; ID sintético 27 só no mock |
| PAGE-02 SE | **não aberto** |

Recomendações:

1. Produto: SE no combo é cadastro operacional? Se não, inativar no combo HMG para não contradizer o skip.
2. Se for cadastro real, a matriz Java precisa existir **antes** de qualquer teste feliz.
3. Manter skip de persistência. Não promover `se.spec.ts` mockado a evidência de DETRAN-SE.
4. Não tratar id 229 como “form ok”.

## CE — lacunas e recomendações

| Fonte | Evidência |
|---|---|
| Combo live | `DETRAN-CE` id **236** ATIVO |
| Matriz Java | sim (TG visível; agente NOME opcional; ~83 visíveis / 26 obrig. — etapa 2) |
| Fixture | `CE.json` `naSuitePlaywright: false` |
| `DetranUf` / spec | **ausente** |
| PAGE-02 CE | **não aberto** |

Recomendações:

1. Autorizar Gate de inspeção **somente leitura** do form CE (sem persistir), separado da BA.
2. Só depois decidir inclusão em `DetranUf` + spec.
3. Não copiar cenários BA (TG existe em CE; `INDICA_NOVO_USADO` Java `[false, false]`).

## RO — lacunas e recomendações

| Fonte | Evidência |
|---|---|
| Combo live | `DETRAN-RO` id **234** ATIVO |
| Matriz Java | sim (TG oculto; ~58 visíveis / 13 obrig. — etapa 2) |
| Fixture | `RO.json` `naSuitePlaywright: false` |
| `DetranUf` / spec | **ausente** |
| PAGE-02 RO | **não aberto** |
| Combo de agentes BA | há opção “Teste RO” — **não** prova form RO |

Recomendações: iguais às de CE, com matriz própria (não reutilizar BA/CE). Não automatizar registro RO agora.

## MS (nota, não está no quarteto pedido)

Combo live ATIVO. Cypress HMG marca `servicoNaoContratado`. Spec mockada passa. Risco de falso verde se a suíte for apontada ao newfront sem persistGuard. Fora do Gate 1 de BA; decisão de produto residual.

## Próximo passo de UF (não autorizado ainda)

Inspecionar **uma** UF por vez, live-readonly, sem Salvar/Registrar. Ordem sugerida só após as decisões MA/SE/CE/RO: CE ou RO (matriz existe) **antes** de MA/SE (matriz não existe).
