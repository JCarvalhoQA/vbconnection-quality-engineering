# Elegibilidade dos 17 negativos apenas mapeados

Decisões possíveis: `READY_FOR_AUTOMATION` · `RULE_NOT_CONFIRMED` · `DEPENDENCY_MISSING` · `BLOCKED` · `OUT_OF_SCOPE`.

Nenhum dos 17 foi promovido por default. Hipótese da matriz antiga **não** vira regra de negócio.

## Matriz

| ID | Cenário | Página | UF | Regra confirmada | Mock possível | Risco | Decisão |
|---|---|---|---|---|---|---|---|
| CT-050 | Chassi com tamanho diferente de 17 | PAGE-02 | — | Não. SCN-CTR-04 = hipótese. Java sem tamanho. Live BA: `A`+Tab sem erro de padrão. | Sim, mas afirmaria regra inventada | P1 | RULE_NOT_CONFIRMED |
| CT-051 | CPF/CNPJ inválido | PAGE-02 | — | Não. Mensagem não serializada (BA-CTR-04 copy PENDENTE). | Sim | P1 | RULE_NOT_CONFIRMED |
| CT-052 | Data inválida / Enter no datepicker | PAGE-02 | — | **Parcial.** Confirmado: Tab não commita o FormControl; POM usa Enter/calendário. **Não** confirmada mensagem de data inválida. | Sim (só o comportamento Tab/Enter) | P1 | READY_FOR_AUTOMATION |
| CT-053 | POST registrar 5xx | PAGE-02 | — | Copy de **sucesso** confirmada. Comportamento de 500 = candidato (SCN-CTR-07). Mensagem de erro HTTP **não** confirmada. | Sim (`registrarStatus`) | P1 | READY_FOR_AUTOMATION |
| CT-054 | Timeout DETRAN (VA-1585) | PAGE-02 | — | Não. Só hipótese I/O. | Delay/abort possível; resultado UI desconhecido | P1 | RULE_NOT_CONFIRMED |
| CT-055 | Acesso sem CONTRATO_EDITAR | PAGE-02 | — | Inferido do guard v2. NX não confirmado. | Roles mockáveis | P0 segurança | RULE_NOT_CONFIRMED |
| CT-060 | Chassi duplicado no DETRAN | PAGE-02 | — | Hipótese explícita: não automatizar até confirmar. | Exigiria órgão/API real ou contrato inventado | P1 | RULE_NOT_CONFIRMED |
| CT-061 | Valores financeiros inconsistentes | PAGE-02 | — | Não | Sim | P2 | RULE_NOT_CONFIRMED |
| CT-064 | Protocolo inexistente não persiste | PAGE-03 | — | Gherkin mapeado; sem POM NX | Sem tela NX estável | P1 | DEPENDENCY_MISSING |
| CT-070 | Nome de arquivo de lote com espaço/hífen | PAGE-05 | — | **v2** `ORIENTACAO_NOME_ARQUIVO_LOTE`. Locators v2 ≠ SoT NX. | Arquivo sintético; POST abortado pelo guard | P1 | DEPENDENCY_MISSING |
| CT-072 | Arquivo vazio no lote | PAGE-05 | — | Não (SCN-LOT-03) | Idem CT-070 | P1 | RULE_NOT_CONFIRMED |
| CT-073 | Extensão zip no lote de contrato | PAGE-05 | — | Não (`nzAccept` hipótese) | Idem | P1 | RULE_NOT_CONFIRMED |
| CT-075 | Regras de nome no aditivo em lote | PAGE-06 | — | Inferido layout NX | Sem POM NX | P2 | RULE_NOT_CONFIRMED |
| CT-077 | Imagem em lote: só ZIP e limite 1 | PAGE-07 | — | v2 confirmado; sem POM NX | Arquivo sintético | P1 | DEPENDENCY_MISSING |
| CT-080 | PDF acima do limite MT (3,5 MB) | PAGE-08 | MT | v2 `upload-limits.ts` + copy `Documento para o estado de {{UF}}…`. NX não validado. | PDF local; sem upload real | P1 | DEPENDENCY_MISSING |
| CT-081 | PDF acima do limite SC (5 MB) | PAGE-08 | SC | Idem CT-080 | Idem | P1 | DEPENDENCY_MISSING |
| CT-082 | PDF acima do limite MS (5 MB) | PAGE-08 | MS | Idem CT-080 | Idem | P1 | DEPENDENCY_MISSING |

## Resumo da decisão

| Decisão | Qtd | IDs |
|---|---:|---|
| READY_FOR_AUTOMATION | 2 | CT-052, CT-053 |
| RULE_NOT_CONFIRMED | 9 | CT-050, CT-051, CT-054, CT-055, CT-060, CT-061, CT-072, CT-073, CT-075 |
| DEPENDENCY_MISSING | 6 | CT-064, CT-070, CT-077, CT-080, CT-081, CT-082 |
| BLOCKED | 0 | — |
| OUT_OF_SCOPE | 0 | — |

## Recorte do que será automatizado

| ID | Classe | O que o teste afirma | O que o teste **não** afirma |
|---|---|---|---|
| CT-052 | FRONTEND_VALIDATION | Tab no `nz-date-picker#dataContrato` **não** dispara POST `contratos/registrar` nem toast de sucesso; permanece em `/contrato/inserir` | Mensagem de “data inválida”; rejeição de `99/99/9999`. A nota etapa-2 “fill+Tab esvazia o FormControl” **não** se reproduziu em 2026-11-10 (valor permanece). |
| CT-053 | MOCKED_API_REJECTION | POST mock 500; ausente `Contrato registrado com sucesso.`; URL inserir; formulário preserva número do contrato | Homologação DETRAN; copy específica de 500 (não documentada) |

UF dos novos testes: **BA** (recorte POM estável; `DATA_CONTRATO` visível). Não generalizar para 18 UFs — o lógico é um por CT.

## Informação ainda necessária (permanecem mapeados)

| ID | O que falta |
|---|---|
| CT-050 | Mensagem/maxlength/minlength observados na Nova UX |
| CT-051 | Copy de documento inválido no blur/submit |
| CT-054 | Contrato de timeout (mensagem, cancelamento, VA-1585 na NX) |
| CT-055 | Redirect `acessoNaoPermitido` (ou equivalente) na Nova UX |
| CT-060 | Contrato de duplicidade DETRAN sem persistência real |
| CT-061 | Quais pares de valor a UI rejeita, por UF |
| CT-064 | POM NX PAGE-03 + copy de protocolo inexistente |
| CT-070 / CT-077 / CT-080–082 | POM NX + evidência de que a copy v2 existe na Nova UX |
| CT-072 / CT-073 / CT-075 | Regra de produto + POM NX |
