# Revisão de cenários

Base: 83 linhas em `../scenarios/SCENARIO-MATRIX.md`. Muitos `SCN-CTR-{UF}-NOVO/USADO` são **hipótese** porque `INDICA_NOVO_USADO` só é obrigatório em **BA**.

## Contagem útil (não inflar UF)

| Família | Qtd na matriz | Com evidência suficiente para automatizar agora | Prioridade |
|---|---|---|---|
| Login / sessão | 12 | 8 mock ou DOM (não Master live) | P0/P1 |
| Contrato genérico | 10 | 3 (destino, vazios, feliz mock) | P0 |
| Contrato × 20 UF novo/usado | 40 | **1** (BA novo/usado, após locator) | P1 só BA |
| PR/PB trava | 2 | 2 no mock; live BLOQUEADO | P0 mock / P1 live |
| SE | 1 | skip de produto | P1 (governança) |
| Aditivo / RS | 6 | 0 NX; 2 candidatos v2 | P1 após Gate 0 PAGE-03 |
| Lote | 5 | só validação de nome de arquivo, sem POST | P1 |
| Imagem | 5 | limites SC/MS/MT no código; DOM n/a | P1 código / P0 MT quando live |

## P0 — fazer primeiro (quando a gate correspondente abrir)

| ID | Por quê | Evidência hoje | Bloqueio |
|---|---|---|---|
| SCN-LGN-01/02 | Porta de entrada | DOM | nenhum para UI pública |
| SCN-LGN-09 | senha expirada real | UI | não alterar senha |
| SCN-LGN-10 | Master | — | BLK-01 credencial |
| SCN-CTR-01 | Destino carrega form | MOCK | real GET form |
| SCN-CTR-02 | vazios não persistem | MOCK | — se POST abortado |
| SCN-CTR-03 | feliz mock | MOCK | **reprogramar massa à fixture** senão mente |
| SCN-CTR-PR-UF / PB-UF | regra de residência | MOCK | texto pode divergir no bundle |
| SCN-IMGT-03 | limite MT | JAVA+V2, não NX | auth + contrato descartável **não** nesta etapa |
| SCN-ADTRS-02 / lote “não POST” | segurança operacional | política | manter abort |

## P1

- Fixture Java × UI para **BA** (único `INDICA_NOVO_USADO` obrigatório; `ANO_FABRICACAO` oculto — o POM atual preenche ano e pode falhar se o campo sumir).
- `TIPO_CONTRATO` oculto vs visível (SP vs PR).
- PAGE-03 busca protocolo inexistente (sem salvar).
- PAGE-04 destino disabled.
- Nome de arquivo lote inválido (sem upload).
- Integração: POST registrar 5xx / timeout — só com mock.

## P2 / P3 — não agora

- Certificado digital.
- 14×19 duplicatas de chassi/CPF/datas por UF.
- Envio B3 como etapa de form (não existe `DadosForm`).
- CE/RO specs.
- Wizard voltar/avançar (form único no POM).

## Lacunas reais (não cobertas nem como hipótese boa)

1. **GET `/api/form/*` real** vs fixture — contrato de API.
2. **Credor obrigatório** (endereço) — Java sim, mock oculta, POM não preenche.
3. **Telefone do devedor** obrigatório na Java, ausente no POM.
4. **Terceiro garantidor** PR/RJ/ES/CE.
5. **Duplicidade de chassi** no DETRAN (serviço externo) — só hipótese; não persistir para descobrir.
6. **Elegibilidade de aditivo** (contrato inexistente / inelegível).
7. **Remover imagem e reanexar** — NÃO CONFIRMADO; não apagar persistido.
8. **Permissão Master sem CONTRATO_EDITAR** (se existir no produto).
9. **Expiração de sessão** real.
10. **MS servicoNaoContratado** no HMG vs spec mockada que passa.

## Gherkin que deve cair ou ser reescrito

```gherkin
# FRÁGIL — trata 19 UFs como iguais
Cenário: registro veículo usado em {UF}
```

Substituir por matriz de decisão:

- Se `INDICA_NOVO_USADO` oculto → não existe o cenário.
- Se obrigatório só BA → um cenário BA novo e um BA usado.
- Placa/Renavam: só se `visivel` na fixture da UF.

```gherkin
# FRÁGIL — contradiz Java em SP
Então o campo Tipo de Contrato está obrigatório
```

Só para UFs com `TIPO_CONTRATO` visível.

## Integração

Permitido no plano: mock 401/500/abort, timeout do client.  
Proibido: POST registrar real, lote, aditivo, B3, DETRAN.

Tag sugerida: `@live-readonly` vs `@mocked`. CI atual permanece `@mocked`.
