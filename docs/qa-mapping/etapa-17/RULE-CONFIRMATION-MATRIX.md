# Confirmação de regras — Grupo A (9)

Legenda de evidência: `CONFIRMED_BY_CODE` · `CONFIRMED_BY_API_CONTRACT` · `CONFIRMED_BY_DOCUMENTATION` · `CONFIRMED_BY_UI` · `PARTIALLY_CONFIRMED` · `RULE_NOT_CONFIRMED`.

O **status do cenário** (intenção CT) permanece `RULE_NOT_CONFIRMED` quando a rejeição esperada não foi vista na Nova UX, mesmo que exista evidência parcial.

| ID | Intenção | UF | Camada candidata | Evidência parcial | Falta | Status da regra |
|---|---|---|---|---|---|---|
| CT-050 | Recusar chassi com tamanho ≠ 17 | — | Front (input) e/ou API | **UI BA:** `maxLength=21`, `*` no rótulo, `A`+Tab sem span I/O/Q (`BA-VEICULO-MODAL.md`). **Código de teste:** factory exige `/^[0-9A-HJ-NPR-Z]{17}$/` (`massaDadosFactory.ts`) — só massa feliz. **Java:** `NUMERO_CHASSI` = `[visível, obrigatório]`, sem tamanho. Template Angular cita letras I/O/Q **não disparadas**. | Mensagem, min/max efetivos, se 16/18 chars bloqueiam Salvar | `PARTIALLY_CONFIRMED` (campo existe / maxlength 21) + intenção **não** confirmada |
| CT-051 | Recusar CPF/CNPJ inválido | — | Front blur e/ou GET/POST | Campo `#devedorCnpj` **CONFIRMADO_TESTE** no POM. Copy de inválido **PENDENTE** (BA-CTR-04). Factory gera CPF com dígito — não prova rejeição. | Algoritmo (formato vs DV), mensagem, momento (blur/submit) | `RULE_NOT_CONFIRMED` |
| CT-054 | Timeout DETRAN (VA-1585) | — | Cliente HTTP / interceptor | CT-011 confirma copy de **instabilidade no login**. CT-053 confirma 500 mocked **sem** copy de erro na PAGE-02. VA-1585 não tem spec I/O neste repo. | Timeout em ms, cancelamento, mensagem PAGE-02, se o POST `contratos/registrar` é o canal | `RULE_NOT_CONFIRMED` |
| CT-055 | Acesso sem `CONTRATO_EDITAR` | — | Guard de rota NX | Permissão **v2** em `PAGE-INVENTORY.md`. Sessão mock inclui a role (`NOVA_UX_SESSION_ROLES`). Redirect `acessoNaoPermitido` **não** observado na NX. | Comportamento NX com roles vazias (blank, 403, toast, home) | `RULE_NOT_CONFIRMED` (inferido v2) |
| CT-060 | Chassi duplicado DETRAN | — | Backend / órgão | Gherkin em `contrato.md` lista como **hipótese explícita**. Nenhum contrato de erro 409/422. | Código HTTP, body, toast, se a checagem é no Salvar veículo ou no Registrar | `RULE_NOT_CONFIRMED` |
| CT-061 | Valores financeiros inconsistentes | — | Front e/ou API | Matriz Java marca visível/obrigatório (`VALOR_TOTAL`, parcelas, juros) por UF — **não** define inconsistência (parcela × n ≠ total, etc.). | Quais pares são inválidos, por UF | `RULE_NOT_CONFIRMED` |
| CT-072 | Arquivo vazio no lote | — | Front `beforeUpload` | SCN-LOT-03 = hipótese. PAGE-05 sem DOM NX. | Mensagem, se 0 bytes é recusado | `RULE_NOT_CONFIRMED` |
| CT-073 | Extensão zip no lote de contrato | — | `nzAccept` | SCN-LOT-04 hipótese. v2 lote contrato aceita txt/csv/xlsx — zip seria recusa **se** o accept NX for o mesmo. | Accept real da NX | `RULE_NOT_CONFIRMED` |
| CT-075 | Nome no aditivo em lote | — | Front (mesma orientação de lote?) | `aditivo-lote.md`: UI **inferida** como próxima do lote de contratos. | Se `ORIENTACAO_NOME_ARQUIVO_LOTE` vale na NX PAGE-06 | `RULE_NOT_CONFIRMED` |

## Grupo B — regra v2 ≠ regra NX

| ID | v2 | NX |
|---|---|---|
| CT-064 | Gherkin: protocolo inexistente não renderiza form (`*ngIf="contrato"`) | DOM e endpoint de busca **não** mapeados |
| CT-070 | `ORIENTACAO_NOME_ARQUIVO_LOTE` recusa espaço/hífen/underscore | Locators v2 ≠ SoT NX |
| CT-077 | ZIP + `limit: 1` | Idem |
| CT-080–082 | `upload-limits.ts` MT 3,5 / SC 5 / MS 5 MB; copy `Documento para o estado de {{UF}}…` | NX não observada; Java MT tela 3,5 ≠ back 4 ≠ lote 12 (`COVERAGE-MATRIX.md`) |

Classificação v2: `CONFIRMED_BY_DOCUMENTATION` / `CONFIRMED_BY_CODE` (legado). Classificação NX: **não** confirmar automaticamente.
