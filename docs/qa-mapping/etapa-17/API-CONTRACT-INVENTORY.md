# Inventário de contratos de API (confiabilidade)

Classificação por elemento: `OBSERVED` · `DOCUMENTED` · `INFERRED` · `UNKNOWN`.
Mock do harness **não** é contrato do backend de produção.

## PAGE-02 — já usados no mocked

| Elemento | Método / rota | Sucesso | Erro | Classificação | Efeito colateral |
|---|---|---|---|---|---|
| Destinos | GET `fornecedores/destinos-combo` | lista `{id, nomeFantasia}` | — | `OBSERVED` no mock; `DOCUMENTED` em `contrato-inserir.md` | leitura |
| Form seções | GET `/form/detran/{id}` | mapa de seções | — | `OBSERVED` mock | leitura |
| Form campos | GET `form/{secao}/detran/{id}` | campos da matriz | — | `OBSERVED` mock | leitura |
| Agentes | GET `agentesFinanceiros` | piloto | — | `OBSERVED` mock | leitura |
| CEP | GET `/cep/{n}` | endereço | — | `OBSERVED` mock | leitura |
| Devedor CNPJ | GET `devedores/cnpj/` | mock devolve `null` | — | `OBSERVED` **só no mock** | leitura; rejeição **UNKNOWN** |
| Registrar | POST `contratos/registrar` | `{protocolo, status: RECEBIDO}` 200 | 500 `{}` (opção etapa 16) | sucesso `OBSERVED` no teste feliz; 500 `OBSERVED` CT-053 (harness) | escrita — live abortada pelo guard |
| Copy sucesso | — | `Contrato registrado com sucesso.` | — | `OBSERVED` UI mocked | — |
| Copy 5xx PAGE-02 | — | — | **não vista** | `UNKNOWN` | — |
| Timeout registrar | — | — | — | `UNKNOWN` | — |
| Chassi duplicado | — | — | — | `UNKNOWN` | órgão |
| CPF inválido API | — | — | — | `UNKNOWN` | — |

`servicos-cliente/vigente` POST `{valor:'150,00'}`: `OBSERVED` mock, consulta, persistGuard mocked **não** aborta.

## PAGE-03 — busca aditivo

| Elemento | Classificação |
|---|---|
| Método/rota da busca por protocolo ou chassi | `UNKNOWN` (v2: focusout; path não versionado neste dest-repo) |
| 404 vs body vazio | `UNKNOWN` |
| Persistência `Registrar Aditivo` | `INFERRED` que entra em `PERSIST_URL_PATTERN` (`aditiv`) |

## PAGE-05/06 — upload lote

| Elemento | Classificação |
|---|---|
| POST de processamento | `INFERRED` URL com `lote`/`upload`/`arquivos` — guard aborta |
| Validação de nome | front v2 `DOCUMENTED`; NX `UNKNOWN` |
| Arquivo vazio / zip | `UNKNOWN` |

## PAGE-07/08 — imagem

| Elemento | Classificação |
|---|---|
| POST upload | `INFERRED` (`imagens?`/`upload`) — guard aborta |
| Limites MT/SC/MS | v2 `DOCUMENTED`; Java **diverge** (`INFERRED` conflito 3,5/4/12) |
| Copy limite | v2 `DOCUMENTED`; NX `UNKNOWN` |

## Não enviar

Nenhuma escrita real. Timeouts e 4xx/5xx de órgão só depois de contrato `DOCUMENTED` ou `OBSERVED` na NX.
