# Locators — registro de contrato (Nova UX)

Escopo do POM `contratoPage.ts`. Unicidade validada pelos testes mockados, não pelo DOM live.

| ID | Página | Etapa | UF | Nome | Tipo | Locator | Alternativo | Obrigatório | Visibilidade | Confiança |
|---|---|---|---|---|---|---|---|---|---|---|
| LOC-CTR-DESTINO | PAGE-02 | Destino | todas mapeadas | Destino | combobox | `page.getByRole("combobox", { name: "Destino" })` | nz-select com label Destino | Sim | Sempre após load | CONFIRMADO_TESTE |
| LOC-CTR-HEADING | PAGE-02 | Título Registrar contrato | todas mapeadas | Título Registrar contrato | heading | `page.getByRole("heading", { name: "Registrar contrato" })` |  | — | Sempre | CONFIRMADO_TESTE |
| LOC-CTR-AGENTE | PAGE-02 | Agente financeiro | todas mapeadas | Agente financeiro | combobox | `page.getByRole("combobox", { name: "Agente financeiro" })` |  | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-ADD-VEIC | PAGE-02 | Adicionar veículo | todas mapeadas | Adicionar veículo | button | `page.getByRole("button", { name: "Adicionar veículo" })` |  | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-CHASSI | PAGE-02 | Chassi | todas mapeadas | Chassi | textbox | `page.getByPlaceholder("Chassi")` | input no modal de veículo | Sim | Após Adicionar veículo | CONFIRMADO_TESTE |
| LOC-CTR-ANO-FAB | PAGE-02 | Ano fabricação | todas mapeadas | Ano fabricação | textbox | `app-consult-filter-field.filter({ hasText: "Ano fabricação" }).locator("input")` | getByLabel quando estável | Condicional | Modal veículo | CONFIRMADO_TESTE |
| LOC-CTR-ANO-MOD | PAGE-02 | Ano modelo | todas mapeadas | Ano modelo | textbox | `app-consult-filter-field.filter({ hasText: "Ano modelo" }).locator("input")` |  | Condicional | Modal veículo | CONFIRMADO_TESTE |
| LOC-CTR-SALVAR-VEIC | PAGE-02 | Salvar veículo | todas mapeadas | Salvar veículo | button | `page.getByRole("button", { name: "Salvar" })` |  | Sim | Modal veículo | CONFIRMADO_TESTE |
| LOC-CTR-TIPO | PAGE-02 | Tipo de Contrato | todas mapeadas | Tipo de Contrato | select | `page.locator("nz-select#tipoContrato")` | getByLabel('Tipo de Contrato') se único | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-NUMERO | PAGE-02 | Número do Contrato | todas mapeadas | Número do Contrato | textbox | `page.getByRole("textbox", { name: "Número do Contrato" })` | aria-required=true | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-DATA | PAGE-02 | Data do contrato | todas mapeadas | Data do contrato | datepicker | `page.locator("#dataContrato input").first()` | Tab após fill — Enter submete o form | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-DEV-DOC | PAGE-02 | CPF / CNPJ do devedor | todas mapeadas | CPF / CNPJ do devedor | textbox | `secao.locator("#devedorCnpj")` | app-contrato-cadastro-devedor-section | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-DEV-NOME | PAGE-02 | Nome completo | todas mapeadas | Nome completo | textbox | `secao.locator("#devedorNome")` |  | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-DEV-CEP | PAGE-02 | CEP | todas mapeadas | CEP | textbox | `secao.locator("#devedorCep")` | IDs prefixados para evitar #enderecoCep duplicado | Sim na massa mock | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-DEV-LOG | PAGE-02 | Logradouro | todas mapeadas | Logradouro | textbox | `secao.locator("#devedorLogradouro")` | preenchido via CEP | Sim na massa mock | Após CEP | CONFIRMADO_TESTE |
| LOC-CTR-DEV-NUM | PAGE-02 | Número | todas mapeadas | Número | textbox | `secao.locator("#devedorNumero")` |  | Sim na massa mock | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-DEV-UF | PAGE-02 | UF do endereço | todas mapeadas | UF do endereço | combobox | `secao.getByRole("combobox", { name: "UF" })` | travada em PR/PB | Sim | Condicional | CONFIRMADO_TESTE |
| LOC-CTR-DEV-CID | PAGE-02 | Cidade | todas mapeadas | Cidade | combobox | `secao.getByRole("combobox", { name: "Cidade" })` |  | Sim | Após UF/CEP | CONFIRMADO_TESTE |
| LOC-CTR-SUBMIT | PAGE-02 | Registrar contrato | todas mapeadas | Registrar contrato | button | `page.getByRole("button", { name: "Registrar contrato" })` | force click por overlay Blip | Sim | Após destino | CONFIRMADO_TESTE |
| LOC-CTR-TOAST | PAGE-02 | Toast NG-ZORRO | todas mapeadas | Toast NG-ZORRO | alert | `page.locator(".ant-message-notice-content").last()` |  | — | Após ação | CONFIRMADO_TESTE |
| LOC-CTR-LOADING | PAGE-02 | Carregando configuração do destino | todas mapeadas | Carregando configuração do destino | text | `page.getByText("Carregando configuração do destino…")` |  | — | Após select Destino | CONFIRMADO_TESTE |

Campos extras da matriz (Renavam, placa, credor, complementar, terceiro garantidor) **não têm locator de POM**. Recomendar `data-testid` ou mapear `formcontrolname` após desbloquear a sessão.
