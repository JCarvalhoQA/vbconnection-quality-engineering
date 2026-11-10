# Perguntas para desenvolvimento e Product Owner

Somente IDs dos 15. Sem live até rotação da credencial Master.

| ID | Funcionalidade | Dúvida | Evidência atual | Informação necessária | Responsável | Impacto na automação | Prioridade |
|---|---|---|---|---|---|---|---|
| CT-050 | PAGE-02 veículo | A NX rejeita chassi com comprimento ≠ 17? Qual mensagem? O `maxLength=21` live BA é intencional? | Factory 17 chars; Java sem tamanho; live BA maxLength 21; `A`+Tab sem erro I/O/Q | min/max, charset (I/O/Q), se a validação é no Salvar ou no Registrar, copy exacta | DEV form veículo + PO | Sem copy, spec negativa inventaria regra | P1 |
| CT-050 | PAGE-02 veículo | A validação é só frontend, só API, ou ambas? | Sem contrato de erro de chassi no mock | Status HTTP e body se o back recusar | DEV API contrato | Decide `FRONTEND_VALIDATION` vs `MOCKED_API_REJECTION` | P1 |
| CT-051 | PAGE-02 devedor | CPF/CNPJ inválido: formato, dígito verificador, CNPJ vs CPF por tipo de pessoa? | `#devedorCnpj` no POM; copy PENDENTE | Momento (blur/submit), mensagem, se aceita pontuação | DEV + PO | Sem mensagem, não automatizar rejeição | P1 |
| CT-051 | PAGE-02 devedor | Existe GET de validação de documento além do POST registrar? | Mock `GET devedores/cnpj/` devolve `null` (`contratoCadastroMocks.ts`) — **OBSERVED** no mock, não contrato real | Contrato real do GET | DEV API | Mock hoje não prova rejeição | P1 |
| CT-054 | PAGE-02 integração | O que a PAGE-02 mostra em timeout do `POST contratos/registrar`? É o mesmo texto de instabilidade do login? | CT-011 login; CT-053 500 sem copy | Timeout (ms), interceptor, preservação do form | DEV front HTTP | Mock delay sem copy vira assert artificial | P1 |
| CT-054 | PAGE-02 | VA-1585 ainda é requisito da Nova UX? | Só menção em matriz de cenários | Sim/não, critério de aceite atual | PO | Se morto, `OUT_OF_SCOPE` | P2 |
| CT-055 | Segurança PAGE-02 | Sem `CONTRATO_EDITAR`, a NX redireciona, 403, ou renderiza o form? | Role no mock; guard v2 não observado na NX | Rota de bloqueio, heading, se o Destino chega a carregar | DEV auth/router | Roles mockáveis; falta oráculo UI | P0 |
| CT-060 | PAGE-02 / DETRAN | Duplicidade de chassi: quando, qual HTTP, qual toast? | Hipótese em `contrato.md` | 409/422/outro, body, se exige órgão real | DEV API + PO | Sem contrato, **não** mockar 409 inventado | P1 |
| CT-061 | PAGE-02 contrato | Quais inconsistências financeiras a NX recusa (parcela × n, IOF, juros)? Por UF? | Matriz só visível/obrigatório | Regras e copies; lista de UFs | PO + DEV | Sem regra, spec falsa | P2 |
| CT-064 | PAGE-03 | Qual endpoint consulta protocolo/chassi na NX? O form some se 404? | v2 `focusout` + `*ngIf="contrato"` | Método, URL, 404 vs 200 vazio, copy | DEV | Sem rota, POM de busca é chute | P1 |
| CT-070 | PAGE-05 | A NX mostra a orientação alfanumérica e recusa hífen **antes** do POST? | v2 `ORIENTACAO_NOME_ARQUIVO_LOTE` | Texto visível NX, se `beforeUpload` retorna false | DEV upload | Arquivo sintético ok; precisa DOM | P1 |
| CT-072 | PAGE-05 | Arquivo 0 bytes é recusado? | Hipótese SCN-LOT-03 | Mensagem ou silêncio | PO + DEV | — | P2 |
| CT-073 | PAGE-05 | `accept` da NX inclui zip? | v2 txt/csv/xlsx | Lista MIME/extensão | DEV | — | P2 |
| CT-075 | PAGE-06 | PAGE-06 reutiliza a mesma regra de nome do PAGE-05? | Inferido em `aditivo-lote.md` | Sim/não + copy | DEV | Evita POM duplicado errado | P2 |
| CT-077 | PAGE-07 | NX ainda é ZIP `limit=1`? Role `IMAGEM` vs `IMAGEM_UPLOAD`? | v2 ZIP/limit 1; mock de sessão tem `IMAGEM`, **não** `IMAGEM_UPLOAD` | Accept, limite, role efetiva NX | DEV + PO | Menu pode nem aparecer | P1 |
| CT-080 | PAGE-08 MT | Qual limite a NX aplica (3,5 / 4 / 12 MB) e qual copy? | v2 3,5 tela; Java 4; lote 12 | Número e string **observados** na NX | DEV + PO | Assertar Java a priori falha | P1 |
| CT-081 | PAGE-08 SC | Limite 5 MB e copy `Documento para o estado de SC…` existem na NX? | Só v2 | Confirmação NX | DEV | — | P1 |
| CT-082 | PAGE-08 MS | Idem MS 5 MB | Só v2 / upload-limits citado | Confirmação NX | DEV | — | P1 |

## Chassi (síntese)

Tamanho 17 é **restrição da massa de teste**, não da Java. UI BA live permite até 21. Duplicidade DETRAN não tem contrato. Camada (front vs API vs órgão) desconhecida.

## CPF/CNPJ (síntese)

Campo existe. DV só na factory. GET `devedores/cnpj/` mockado como `null` (`OBSERVED` no harness, `UNKNOWN` no produto).

## HTTP (síntese)

500 mocked: sem copy, form permanece (CT-053). Timeout PAGE-02: `UNKNOWN`. Não reutilizar a copy de login sem evidência.
