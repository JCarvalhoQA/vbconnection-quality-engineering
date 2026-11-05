# Revisão dos locators

A etapa 1 citou **33 locators validados** = 12 de login/senha expirada (DOM/UI live) + 21 do POM de contrato (teste mockado).

O catálogo em `locators/` tem **38** linhas se somar 2FA, recuperação e home (`LOC-LGN-13/14`, `LOC-HOME-*`). Abaixo os **33** do total oficial; o restante fica no apêndice como extra.

**Nova UX confirmada no DOM live:** só PAGE-01 (login + alterar senha). PAGE-02 é **CONFIRMADO_TESTE contra mock**, não contra o bundle autenticado.

Legenda: Est. = estabilidade · Único = unicidade no contexto · NX = compatível com Nova UX publicada.

## Os 33

### A. Login / senha expirada — DOM live (12)

| ID | Locator | Est. | Único | Origem | NX | Uso etapa 2 |
|---|---|---|---|---|---|---|
| LOC-LGN-01 | `#login-username` | Alta (id de produto) | Sim | CONFIRMADO_DOM | Sim | Manter; preferir também role `Usuário *` |
| LOC-LGN-02 | `#login-password` | Alta | Sim | CONFIRMADO_DOM | Sim | Manter |
| LOC-LGN-03 | `getByRole(button, Entrar)` | Alta | Sim | CONFIRMADO_DOM | Sim | Manter |
| LOC-LGN-04 | `Esqueceu a senha?` | Alta | Sim | CONFIRMADO_DOM | Sim | Manter |
| LOC-LGN-05 | `Acessar com certificado digital` | Alta | Sim | CONFIRMADO_DOM | Sim | Manual / skip Web PKI |
| LOC-LGN-06 | heading Olá!… | Alta | Sim | CONFIRMADO_DOM | Sim | Guard de `gotoApp` |
| LOC-LGN-07 | `Pular para o conteúdo` | Alta | Sim | CONFIRMADO_DOM | Sim | a11y |
| LOC-LGN-08 | toggle senha **sem nome** | **Baixa** | Não (botão mudo) | CONFIRMADO_DOM fraco | Sim, mas ilegível | **Candidato a `data-testid`**; não usar nth() |
| LOC-LGN-09 | `#expirada-password` | Alta (id) | Sim | CONFIRMADO_UI | Sim | Não submeter troca de senha |
| LOC-LGN-10 | `#expirada-new-password` | Alta | Sim | CONFIRMADO_UI | Sim | Placeholder genérico — não usar placeholder |
| LOC-LGN-11 | `#expirada-confirm-password` | Alta | Sim | CONFIRMADO_UI | Sim | Idem |
| LOC-LGN-12 | `Alterar Senha` (disabled) | Alta | Sim | CONFIRMADO_UI | Sim | Só assert de política; não clicar com senha nova real |

### B. Contrato PAGE-02 — POM + mock (21)

Não revalidados no newfront autenticado. Compatibilidade Nova UX = **provável** (os testes passaram no bundle publicado **com APIs fake**). Se o GET real esconder campos, vários desses locators passam a “não visível” — isso é desejável, não falha de seletor.

| ID | Locator | Est. | Único | Origem | Risco | Etapa 2 |
|---|---|---|---|---|---|---|
| LOC-CTR-DESTINO | `getByRole(combobox, Destino)` | Alta | Sim no form | CONFIRMADO_TESTE | overlay CDK | Manter |
| LOC-CTR-HEADING | heading Registrar contrato | Alta | Sim | CONFIRMADO_TESTE | copy | Manter |
| LOC-CTR-AGENTE | combobox Agente financeiro | Alta | Sim após destino | CONFIRMADO_TESTE | asterisco pode cair em BA (matriz) | Condicionar à fixture |
| LOC-CTR-ADD-VEIC | Adicionar veículo | Alta | ? se houver outro “Adicionar” | CONFIRMADO_TESTE | | Manter scoped na seção Veículos |
| LOC-CTR-CHASSI | placeholder `Chassi` | Média | No modal | CONFIRMADO_TESTE | placeholder pode repetir | Preferir getByLabel após Gate 0 |
| LOC-CTR-ANO-FAB | `app-consult-filter-field` + texto | Média | Depende do label | CONFIRMADO_TESTE | componente de filtro genérico | Candidato a testid; BA oculta o campo na Java |
| LOC-CTR-ANO-MOD | idem | Média | idem | CONFIRMADO_TESTE | | Idem |
| LOC-CTR-SALVAR-VEIC | button Salvar | Média | Pode haver Salvar no form | CONFIRMADO_TESTE | | Scope no modal |
| LOC-CTR-TIPO | `nz-select#tipoContrato` | Alta se o campo existir | Sim quando visível | CONFIRMADO_TESTE | **Java oculta em SP** | Não assertar visível-sempre |
| LOC-CTR-NUMERO | textbox Número do Contrato | Alta | Sim + aria-required | CONFIRMADO_TESTE | | Manter; revalidar aria no DOM real |
| LOC-CTR-DATA | `#dataContrato input`.first() | Média | `.first()` justificado (nz-date-picker) | CONFIRMADO_TESTE | Enter submete | Manter Tab; ES/DF/MT podem ocultar |
| LOC-CTR-DEV-DOC | `#devedorCnpj` no section | Alta | Prefixo resolveu duplicata | CONFIRMADO_TESTE | | Manter âncora `app-contrato-cadastro-devedor-section` |
| LOC-CTR-DEV-NOME | `#devedorNome` | Alta | Sim na seção | CONFIRMADO_TESTE | | Manter |
| LOC-CTR-DEV-CEP | `#devedorCep` | Alta | Sim | CONFIRMADO_TESTE | | Manter |
| LOC-CTR-DEV-LOG | `#devedorLogradouro` | Alta | Sim | CONFIRMADO_TESTE | valor via CEP mock | Manter |
| LOC-CTR-DEV-NUM | `#devedorNumero` | Alta | Sim | CONFIRMADO_TESTE | | Manter |
| LOC-CTR-DEV-UF | combobox UF na seção | Média | Vários combobox UF no form | CONFIRMADO_TESTE | precisa da âncora da seção | Manter scoped; PR/PB trava |
| LOC-CTR-DEV-CID | combobox Cidade | Média | idem | CONFIRMADO_TESTE | | Manter scoped |
| LOC-CTR-SUBMIT | Registrar contrato | Alta | Sim | CONFIRMADO_TESTE | Blip → force | Manter hide+abort; **nunca sem mock POST** |
| LOC-CTR-TOAST | `.ant-message-notice-content`.last() | **Baixa** | `.last()` | CONFIRMADO_TESTE | toasts empilham | Candidato: filtrar por texto, não last cego |
| LOC-CTR-LOADING | texto Carregando configuração… | Média | copy | CONFIRMADO_TESTE | i18n | Manter como wait negativo |

## Apêndice — fora dos 33 (candidatos / já no POM)

| ID | Origem | NX | Nota |
|---|---|---|---|
| LOC-LGN-13 `#codigo-segunda-etapa` | CONFIRMADO_TESTE mock | Inferido no live | Não visto no newfront nesta auditoria |
| LOC-LGN-14 `#recuperacao-usuario` | CONFIRMADO_TESTE; um fluxo `test.fixme` | Inferido | GET 500 conhecido |
| LOC-HOME-01 heading Bem-vindo | CONFIRMADO_TESTE mock | BLOQUEADO live | Senha expirada impede home real |
| LOC-HOME-02 atalho Registro de Contrato | CONFIRMADO_TESTE | BLOQUEADO live | strong exact |
| LOC-HOME-03 Sair + modal Sim | CONFIRMADO_TESTE | BLOQUEADO live | |
| Locators aditivo/lote/imagem | CONFIRMADO_CODIGO **v2** | **Candidatos**, não validados | Não usar como SoT Nova UX |

## Campos da matriz **sem** locator

Renavam, placa, tipo espécie, credor endereço, telefones, índice consórcio, terceiro garantidor, tipo aditivo. Status: **candidato**. Gate 0 deve dumpá-los no DOM da UF piloto, não chutar `formcontrolname`.

## Regras para a implementação futura

1. Não apagar os 33; ajustar **asserts de visibilidade** à fixture.
2. Não promover locator v2 a Nova UX sem dump.
3. Não adicionar `nth()` no toggle de senha.
4. `data-testid` só com autorização de front (lista já em `LOCATOR-STANDARDS.md`).
