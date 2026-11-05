# Conciliação de UFs

Nenhuma UF é tratada como **suportada na Nova UX real** neste documento. “Presente em X” ≠ “homologada no newfront”.

## As listas

| Fonte | Quantidade | UFs | Papel |
|---|---|---|---|
| Pedido original da auditoria | 19 | AC AP BA DF ES MG MS MT PB PE PR RJ RN RR RS SC **SE** SP TO | Referência de descoberta de UI |
| `DETRAN` Java (`auto.data`) | 21 constantes | as 19 **menos SE** **mais CE, RO, UN** | Enum de negócio / `fromUf` |
| Matriz `MatrizDados*.java` | 20 colunas | AC AP BA **CE** DF ES MG MS MT PB PE PR RJ RN **RO** RR RS SC SP TO | Campos visível/obrigatório |
| `DetranNumeroEnum` (v2, HMG) | 20 IDs | 19 menos SE mais CE RO (sem UN; `DETRANALL=99`) | ID de fornecedor no front legado |
| Playwright `DETRAN_CONFIG` | 19 | pedido original, **com SE**, **sem CE/RO** | Combo mockado |
| `fixtures/detrans.json` | 19 | igual ao Playwright | Legado Cypress |
| `detransIgnorados.json` | 3 flags | PR = WebPKI; **SE = formularioIndisponivel**; MS = servicoNaoContratado | Restrição HMG conhecida |
| Documentos `states/*.md` | **21 arquivos** | 20 da matriz Java + `SE.md` | Inventário da etapa 1, não suporte |

**UN** (`UNIFICADO`) está no enum Java e **não** tem coluna na matriz de campos. Não há arquivo `UN.md`. Não entra nas 21.

## Por que 21 documentos

```
20 UFs com coluna na matriz Java
+ 1 arquivo SE.md (ausência documentada)
= 21 arquivos em docs/qa-mapping/states/
```

Isso **não** significa 21 destinos disponíveis no newfront. Significa 20 regras de formulário versionadas no backend + 1 UF citada no pedido/Playwright sem enum de formulário.

## SE — não suportada como DETRAN de formulário

Evidências de **não suporte**:

| Evidência | O que diz | Confiança |
|---|---|---|
| `DETRAN` Java | constante SE **inexistente** | CONFIRMADO_CODIGO |
| `MatrizDados*` | sem coluna SE | CONFIRMADO_CODIGO |
| `DetranNumeroEnum` | sem `DETRANSE` | CONFIRMADO_CODIGO |
| `detransIgnorados.json` | `"formularioIndisponivel": ["DETRAN-SE"]` | CONFIRMADO_CODIGO |
| `detransIds.ts` | ID **sintético 27**; comentário: “SE não possui enum no produto” | CONFIRMADO_CODIGO |
| `FormRestController.getDadosForm` | `DETRAN.fromUf(uf)` → `null` se o fornecedor fosse SE → NPE/`column(null)` | INFERIDO (caminho de código) |
| Combo newfront live | **não inspecionado** (auth Master bloqueada) | BLOQUEADO |
| `se.spec.ts` | corre só contra mock homogêneo | CONFIRMADO_TESTE **do mock**, não do produto |

**Conclusão etapa 2:** SE permanece **fora do escopo de suporte**. Os testes `se.spec.ts` são regressão do mock, não evidência de DETRAN-SE. Não gerar fixture Java para SE. Não tratar ID 27 como ID HMG.

## CE e RO — existem no backend, não na suíte 19

| Tema | CE | RO |
|---|---|---|
| Enum Java | sim | sim |
| Matriz de campos | sim (CE: 83 visíveis / 26 obrig.; RO: 58 / 13) | sim |
| `DetranNumeroEnum` HMG | 236 | 234 |
| `DetranNumeroEnum` PRD | 29 | 28 |
| Playwright 19 / `detrans.json` | **ausente** | **ausente** |
| Nova UX live | BLOQUEADO | BLOQUEADO |
| Terceiro garantidor (matriz) | seção visível | não |
| Agente `NOME` | opcional | opcional |

**Conclusão:** CE e RO são **candidatas a suporte de produto**, não confirmadas no newfront. Não automatizar até o combo `destinos-combo` real listar `DETRAN-CE` / `DETRAN-RO` (GET, sem persistir).

## IDs HMG vs PRD (quando a UF existe no enum)

Confirmado em `DetranNumeroEnum` (front v2). Playwright já usa o lado HMG para a suíte 19, **exceto** CE/RO (nem sequer estão no tipo `DetranUf`).

| UF | ID estável | HMG | PRD |
|---|---|---|---|
| SP | 1 | 1 | 1 |
| PE | 3 | 3 | 3 |
| SC | 4 | 4 | 4 |
| MG | 9 | 9 | 9 |
| PR | 10 | 10 | 10 |
| RR | 11 | 11 | 11 |
| PB | 13 | 13 | 13 |
| BA | 14 | 14 | 14 |
| RJ | 16 | 16 | 16 |
| AC | 17 | 17 | 17 |
| AP | — | 225 | 8 |
| MS | — | 226 | 12 |
| RN | — | 228 | 18 |
| TO | — | 122 | 19 |
| ES | — | 230 | 20 |
| RS | — | 231 | 23 |
| DF | — | 232 | 21 |
| MT | — | 233 | 26 |
| RO | — | 234 | 28 |
| CE | — | 236 | 29 |

Bug colateral (legado v2, não Playwright): `DetranUfNumeroEnum.RN = Number(DetranNumeroEnum.DETRANRR)` — RN aponta para o ID de **RR**. Não usar essa enum na suíte nova.

## Interseção útil para a etapa 2

| Conjunto | UFs | Uso proposto |
|---|---|---|
| **A — overlap Java ∩ Playwright** | 18: AC AP BA DF ES MG MS MT PB PE PR RJ RN RR RS SC SP TO | Únicas para as quais existe **matriz + wrapper de teste**. Ainda **não** são “suportadas na UX real”. |
| **B — só Java** | CE, RO | Fora da suíte; exigir evidência de combo real antes de criar spec. |
| **C — só Playwright/pedido** | SE | Mock-only; não promover a suporte. |
| **D — enum sem matriz** | UN | Fora de registro de contrato por UF. |

MS: ignorado em HMG Cypress por `servicoNaoContratado`, mas a suíte mockada **não aplica** esse ignore (`detransConfig.ts`). Risco de falso verde vs HMG real.

PR/RJ/TO: `requerWebPki` no Playwright; PR também em `detransIgnorados.webPki`. Automação de certificado continua fora de escopo.

## Classificação operacional (etapa 2)

| Status | Critério | UFs |
|---|---|---|
| **NÃO SUPORTADA (form)** | Sem enum/matriz; fixture Cypress “formulário indisponível” | SE |
| **BACKEND MAPEADO, UX NÃO EVIDENCIADA** | Matriz Java existe; combo newfront não visto | 20 da matriz, inclusive CE/RO |
| **TESTE MOCKADO EXISTE** | Wrapper `{uf}.spec.ts` | 18 do conjunto A + SE |
| **SUPORTADA NA NOVA UX REAL** | Destino visível no combo live + form carrega | *vazio até Gate 0* |
