# Catálogo de locators PAGE-02 (Nova UX)

**Classe:** LIVE_DOM / LIVE_UI  
**Regra:** `getByRole` + `#id` estático. IDs `*-veic-{timestamp}-n` INSTAVEL. `formcontrolname` `uf|cidade|numero|cep|nome|cnpj` só com âncora de seção.

POM de produção **não** foi alterado.

## Núcleo (21 UFs com form)

| Alvo | Preferencial | Alternativo | Evidência |
|---|---|---|---|
| Página | `getByRole('heading', { name: 'Registrar contrato' })` | URL `/contrato/inserir` | LIVE_UI |
| Destino | `getByRole('combobox', { name: /Destino/i })` | `#destino` | LIVE_UI |
| Alterar destino | `getByRole('button', { name: 'Alterar destino' })` | — | LIVE_DOM |
| Agente | `getByRole('combobox', { name: /Agente financeiro/i })` | `#agenteFinanceiroCadastro` | LIVE_UI |
| CNPJ agente | `#cnpjAgenteFinanceiro` | — | LIVE_DOM |
| Veículos | `getByRole('heading', { name: 'Veículos' })` | `article` filtrado | LIVE_UI |
| Adicionar veículo | `getByRole('button', { name: /Adicionar veículo/i })` | POM `adicionarVeiculo` | LIVE_UI |
| Registrar | `getByRole('button', { name: /Registrar contrato/i })` | — | LIVE_DOM **não clicar** |
| Nº contrato | `#numeroContrato` | textbox nome | LIVE_DOM |
| Tipo restrição | `#tipoGravame` | combobox | LIVE_DOM (quando existe) |
| Devedor doc/nome/UF/cidade | `#devedorCnpj` `#devedorNome` `#devedorUf` `#devedorCidade` | — | LIVE_DOM |
| Credor | `#credorCep` … `#credorTelefone` | seção Credor | LIVE_DOM |
| Documentos | heading `Documentos` | dropzone — **não** upload | LIVE_DOM |

## Veículo (âncora `article` + heading Veículos)

| Alvo | Locator | Notas |
|---|---|---|
| Chassi | `getByRole('textbox', { name: /^Chassi/i })` | 21 UFs |
| Gravame | textbox `/gravame\|restrição/i` | ES/RS sem `*` |
| Zero km | `getByRole('combobox', { name: /Veículo zero km/i })` | 21 UFs; não radio no live |
| Novo/usado | `getByRole('combobox', { name: /Novo\s*\/\s*usado/i })` | **só BA** |
| Ano fabricação | textbox `/Ano fabricação/i` | BA ausente |
| Situação chassi | combobox `/Situação do chassi/i` | BA/RO/MT/DF ausente ou varia |
| Marca / modelo | combobox `/Marca \/ modelo/i` | várias |
| UF placa / Placa / RENAVAM | combobox `/UF da placa/` · textbox Placa · RENAVAM | só zero km = Não |
| Número motor | textbox `/Número motor/i` | **só BA** neste mapeamento |
| Excluir | `getByRole('button', { name: /Excluir veículo/i })` | descarte |
| Salvar | `getByRole('button', { name: /^Salvar$/i })` | não clicar |
| Dialog / Cancelar | — | **ausentes** |

## TG (CE, ES, MA, PR, RJ)

Âncora heading `Terceiro garantidor`. IDs `#terceiroCodigo` `#terceiroCnpj` `#terceiroNome` `#terceiroCep` `#terceiroUf` `#terceiroCidade` `#terceiroTelefone` `#terceiroCelular`. Não focar CEP.

## Por origem vs POM

| Origem | Situação |
|---|---|
| LIVE_UI | Destino, Adicionar veículo, Chassi, zero km, Excluir — validados nas 21 |
| JAVA | visibilidade de ano/TG/Novo-usado; **não** usar como locator |
| MOCK | combo 19 UFs; SE skip; CE/RO/MA ausentes |
| POM hoje | Destino + BA ok; dialog/Cancelar/zero km/placa **desatualizados** |

## Não usar

- `nth=` em `uf`/`numero`
- `#chassi` (live prefixa `veiculoChassi-veic-…`)
- `getByRole('dialog')` para incluir veículo
- overlay Destino depois de disabled
- nome de usuário / CNPJ de agente
