# Matriz de cobertura revisada (níveis de confiança)

Camada ≠ “passou no Playwright”. Um `CONFIRMADO_TESTE` com mock **não** sobe para `CONFIRMADO_UI`.

## Camadas

| Código | Significado nesta etapa |
|---|---|
| DOM | Elemento visto no newfront (login / senha expirada) |
| UI | Comportamento observado no newfront sem persistir |
| JAVA | `MatrizDados*` / `FormRestController` / `DETRAN` / `PerfilEnum` |
| POM | Page Object Nova UX existente |
| MOCK | Resposta interceptada em `contratoCadastroMocks` / `auth.ts` |
| V2 | HTML/TS `vb-auto-v2` (legado) |
| — | Sem evidência |

## Páginas

| Página | DOM | UI | JAVA | POM NX | MOCK | V2 | Lacuna principal |
|---|---|---|---|---|---|---|---|
| PAGE-01 login | sim | sim | n/a | sim | sim (fluxos) | n/a | Master; home real |
| PAGE-01 home | — | — | n/a | sim | sim | n/a | senha expirada / sem Master |
| PAGE-02 contrato | — | — | sim | sim | **homogêneo** | parcial | GET real vs mock; locators de campos extras |
| PAGE-03 aditivo | — | — | sim (matriz aditivo) | — | — | sim | POM NX; busca protocolo |
| PAGE-04 aditivo RS | — | — | sim (UF=RS) | — | — | sim | destino disabled só no v2 |
| PAGE-05 lote contrato | — | — | n/a form | — | — | sim | upload real proibido |
| PAGE-06 lote aditivo | — | — | n/a form | — | — | sim | idem |
| PAGE-07 imagem lote | — | — | limite ZIP n/a | — | — | sim | ZIP real proibido |
| PAGE-08 imagem tela | — | — | limite SC/MS/MT | — | — | sim | PDF real; regra remover/reanexar |

## UFs × evidência de suporte

| UF | JAVA matriz | Spec mock | Combo live | Form live | Tratar como |
|---|---|---|---|---|---|
| 18 do overlap | sim | sim | — | — | mockável com fixture Java; UX **não** confirmada |
| CE RO | sim | — | — | — | backlog após destinos-combo |
| SE | — | sim (ID 27) | — | — | **não suportada**; skip/remover do significado de produto |
| UN | enum só | — | — | — | fora |

## Recorte Página → UF → Etapa → Campo → Regra → Cenário → Locator → Evidência

Só linhas com pelo menos uma evidência **não-hipótese**. Hipóteses ficam em [SCENARIO-REVIEW.md](./SCENARIO-REVIEW.md).

| Página | UF | Etapa | Campo | Regra | Cenário | Locator | Evidência |
|---|---|---|---|---|---|---|---|
| PAGE-01 | — | Login | username/password | obrigatório | SCN-LGN-01/02 | `#login-username` `#login-password` | DOM |
| PAGE-01 | — | Login | submit vazio | mensagens | SCN-LGN-02 | role Entrar | POM+TESTE (pode ser mock-free: é UI local) |
| PAGE-01 | — | Expirada | política senha | 8/Aa/esp/núm; botão disabled | SCN-LGN-09 | `#expirada-*` | UI live |
| PAGE-01 | — | Auth | 401 | texto inválidos | SCN-LGN-03 | | MOCK |
| PAGE-02 | 18 | Destino | Destino | dispara form | SCN-CTR-01 | combobox Destino | POM+MOCK |
| PAGE-02 | 18 | Veículo | NUMERO_CHASSI | obrigatório Java+mock | SCN-CTR-03 | placeholder Chassi | JAVA + POM+MOCK |
| PAGE-02 | 18 | Contrato | NUMERO | obrigatório | SCN-CTR-03 | textbox Número do Contrato | JAVA + POM+MOCK |
| PAGE-02 | SP e 11 outras | Contrato | TIPO_CONTRATO | Java **oculto**; mock **obrig.** | — | `#tipoContrato` | **divergência**; sem evidência UX |
| PAGE-02 | BA | Veículo | INDICA_NOVO_USADO | Java obrigatório | SCN-CTR-BA-NOVO | *sem POM* | JAVA só |
| PAGE-02 | BA | Veículo | ANO_FABRICACAO | Java oculto | | fillByLabel ainda preenche | divergência POM×JAVA |
| PAGE-02 | PR PB | Devedor | UF | trava + alerta | SCN-CTR-PR-UF / PB | combobox UF seção | POM+MOCK (texto hardcoded) |
| PAGE-02 | CE ES PR RJ | TG | seção | visível Java; mock omite | SCN-CTR-10 | *sem POM* | JAVA só |
| PAGE-02 | SE | — | — | form indisponível | SCN-CTR-SE-ID | combo mock | JAVA ausente + fixture ignorados |
| PAGE-03 | RR PR SC AC AP RS | Aditivo | TIPO_ADITIVO | visível Java | SCN-ADT-04 | candidato v2 | JAVA + V2 |
| PAGE-04 | RS | Destino | disabled | v2 | SCN-ADTRS-01 | candidato v2 | V2 |
| PAGE-08 | MT | Upload | 3,5 MB tela / 4 MB back | mensagem | SCN-IMGT-03 | candidato v2 | JAVA `getMaxUploadBytes` + `upload-limits.ts` (tela 3,5 ≠ back 4) |
| PAGE-08 | SC MS | Upload | 5 MB | mensagem | SCN-IMGT-04 | candidato v2 | JAVA + V2 |

## O que os 19 wrappers `{uf}.spec.ts` realmente cobrem

Dois testes por UF, **idênticos** no fluxo:

1. Obrigatórios vazios → toasts de veículo + campos (textos do **front mockado**).
2. Happy path mock → POST interceptado `RECEBIDO`.

Não cobrem: matriz Java, credor, TG, B3, chassi inválido, duplicidade DETRAN, novo vs usado (exceto massa sempre “novo”), CE/RO, Master, API real.

Isso é cobertura **horizontal de mock**, não cobertura de regra por UF.

## Divergência extra de limite de imagem (MT)

| Camada | Limite |
|---|---|
| Front v2 tela | 3,5 MB (`upload-limits.ts`) |
| Java `getMaxUploadBytes` | 4 MB |
| Java lote MT | 12 MB |

Três números. Nova UX **não confirmada**. Cenário P0 de MT deve assertar a mensagem **observada**, não a tabela Java a priori.
