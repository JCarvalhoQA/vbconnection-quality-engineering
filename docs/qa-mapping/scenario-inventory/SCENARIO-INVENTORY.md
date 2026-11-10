# Inventário canônico de cenários mapeados

Fonte: specs em `e2e/`, POM/`support/`, `docs/qa-mapping/scenarios/SCENARIO-MATRIX.md`, páginas, inventário live, matriz Java. SHA `60afe1163606a4cb42d18d6bfbf0e1720585ba82`.

IDs canônicos `CT-001`–`CT-086`. Os 83 originais foram preservados; a Etapa 18 adicionou CT-084–CT-086 (Confluence DETRAN-BA) após checagem de duplicidade. São cenários lógicos, não instâncias de execução nem assertions isoladas.

## Metodologia

1. Um **cenário lógico** = uma intenção de teste (ex.: casca PAGE-02), não 21 regras distintas.
2. **Instância** = o mesmo lógico aplicado a uma UF ou tela.
3. **Implementação** = existe `test()` / helper que exerce a intenção.
4. **Execução** = run GitHub/local comprovado. Sem run = `NOT_VERIFIED`.
5. Live histórico **não** cobre o SHA atual.
6. Hipóteses da matriz (chassi ≠ 17, B3, 40× novo/usado) entram como **apenas mapeado**; `RULE_NOT_CONFIRMED` quando a UI/regra não foi confirmada.

## Distribuição por funcionalidade (lógicos)

| Área | IDs | Qtd |
|---|---|---:|
| PAGE-01 Login | CT-001–CT-018 | 18 |
| PAGE-HOME | CT-019–CT-023 | 5 |
| Consulta / Clientes / Telas padrão | CT-024–CT-026 | 3 |
| PAGE-02 a11y / estabilidade | CT-027–CT-028 | 2 |
| PAGE-02 estrutural | CT-029–CT-044 | 16 |
| PAGE-02 funcional / integração | CT-045–CT-062 | 18 |
| PAGE-03 Aditivo | CT-063–CT-067 | 5 |
| PAGE-04 Aditivo RS | CT-068–CT-069 | 2 |
| PAGE-05 Lote | CT-070–CT-074 | 5 |
| PAGE-06 Aditivo lote | CT-075–CT-076 | 2 |
| PAGE-07 Imagem lote | CT-077 | 1 |
| PAGE-08 Imagem por tela | CT-078–CT-083 | 6 |
| PAGE-02 Confluence BA (etapa 18) | CT-084–CT-086 | 3 |
| **Total** | | **86** |

Status de automação exclusivo (CSV): Automatizado 45 · Parcialmente 4 · Apenas mapeado 30 · Bloqueado 4 · Não aplicável 3 = **86**. Etapa 18: CT-084–086 novos e automatizados mocked; CT-047 ganhou assert de payload; CT-053 ganhou instâncias 400/503. PAGE-07/08 continuam sem spec funcional de upload. Detalhe: `EXECUTIVE-SUMMARY.md`.

Tabela completa (Excel/Jira): `SCENARIO-INVENTORY.csv` (UTF-8 BOM, 86 linhas de dados, 16 colunas).

### Recorte da matriz (cenários reais)

| ID | Página | Cenário | UF | Tipo | Automação | Ambiente | Evidência |
|---|---|---|---|---|---|---|---|
| CT-001 | PAGE-01 | Exibe formulário de login | — | Estrutural | Automatizado | Mocked | `e2e/login/login.spec.ts` |
| CT-002 | PAGE-01 | Submit vazio | — | Funcional negativo | Automatizado | Mocked | `login.spec.ts` |
| CT-029 | PAGE-02 | Casca visual | 21 UFs | Estrutural | Automatizado | Mocked; live hist. 19 | `definirEstruturalPage02.ts` + `page02Structural.ts` |
| CT-031 | PAGE-02 | Novo/usado visível | BA | Estrutural; condicional | Automatizado | Mocked + live hist. | inventário + `expectNovoUsado` |
| CT-046 | PAGE-02 | Submit sem veículo | 18 UFs | Funcional negativo | Automatizado | Mocked | `validarCamposObrigatorios` |
| CT-047 | PAGE-02 | Registro feliz mock | 18 UFs | Funcional positivo | Automatizado | Mocked | `registro-contrato.flow.ts` + payload BA |
| CT-050 | PAGE-02 | Chassi ≠ 17 | — | Funcional negativo | Apenas mapeado | — | `RULE_NOT_CONFIRMED` |
| CT-052 | PAGE-02 | Tab no datepicker não registra | BA | Funcional negativo | Automatizado | Mocked | `contrato-negativos.spec.ts` |
| CT-053 | PAGE-02 | POST registrar 400/500/503 | BA | Integração mocked | Automatizado | Mocked | `api-negativos.spec.ts` + `contrato-excecoes.spec.ts` |
| CT-084 | PAGE-02 | Gravame maxLength 8 | BA | Funcional negativo | Automatizado | Mocked | `contrato-negativo.spec.ts` |
| CT-085 | PAGE-02 | Parcelas sem negativo | BA | Funcional negativo | Automatizado | Mocked | `contrato-negativo.spec.ts` |
| CT-086 | PAGE-02 | Financiamento sem negativo | BA | Funcional negativo | Automatizado | Mocked | `contrato-negativo.spec.ts` |
| CT-057 | PAGE-02 | Envio B3 | — | Integração | Apenas mapeado | — | sem `DadosForm` |
| CT-063 | PAGE-03 | Busca protocolo existente | — | Funcional | Apenas mapeado | — | `aditivo-inserir.md` |
| CT-068 | PAGE-04 | Destino RS disabled | RS | Estrutural | Apenas mapeado | — | v2 `AditivoFormRsComponent` |
| CT-070 | PAGE-05 | Nome de arquivo inválido | — | Funcional negativo | Apenas mapeado | — | `contrato-lote.md` |
| CT-080 | PAGE-08 | PDF > 3,5 MB | MT | Funcional negativo | Apenas mapeado | — | upload-limits v2 |

## PAGE-01 — Login

Automatizados mocked: formulário, vazios, 401, bloqueio 5ª, admin, deep link, 2FA, logout, senha expirada, rede, recuperação (exceto 500), trim.

Bloqueados: Master live (CT-010), recuperação 500 `test.fixme` (CT-016).

Apenas mapeado: certificado digital (CT-012).

## PAGE-02 — Registro de contrato

**Estrutural (readonly):** um `test()` mocked e um live por UF em `definirEstruturalPage02` / BA-CE-RO. Exercem casca, `*`, veículo, Zero km, TG, credor, descarte. Não homologam registro.

**Funcional mocked:** `registro-contrato.flow.ts` — 18 UFs (`DetranUf` sem CE/RO/MA). Dois fluxos: obrigatórios+toast sem veículo; registro feliz com POST mockado. PR/PB: alerta de residência embutido no POM.

**Integração DETRAN/B3:** não há spec que prove retorno de órgão. persistGuard aborta `/api/b3/enviar`. RSK-02.

## PAGE-03 a PAGE-08 (repositório)

Sem Playwright na Nova UX. Mapeamento em `docs/qa-mapping/pages/*` e Gherkin em `scenarios/`. Live BLOQUEADO (auth Master).

## Outras páginas no repo

Consulta de contratos, lista de clientes, 16 telas padrão (relatórios/admin), home/menu. Smoke de abertura, não regras de negócio profundas.

## Evidência de execução

| Camada | Run | SHA | Nota |
|---|---|---|---|
| Mocked CI | [42635151327](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42635151327) | `ae18d2c` | success; ancestral do merge `60afe11` |
| Live 15 UFs | [42267723718](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42267723718) | `83bcb5ed` | histórico |
| Live lote 4 | [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) | `a65997cc` | histórico |
| Live SHA `60afe11` | — | — | **nenhum** |

Gates 0–3 live existem no código e ficam `test.skip` sem flags; não entram na regressão mocked.
