# TO — PAGE-02 Nova UX

**Evidência:** GATE3 · LIVE_DOM / LIVE_UI  
**id destinos-combo:** 122  
**Formulário:** disponível  
**Matriz Java:** sim · **Suíte Playwright:** sim

## Seções

- Registrar contrato
- Destino
- Agente financeiro
- Veículos
- Contrato
- Devedor
- Credor
- Dados complementares
- Documentos

## Contagens (casca)

| Métrica | Valor |
|---|---|
| Campos | 48 |
| Obrigatórios visuais | 16 |
| Credor | presente |
| Documentos | presente |
| Terceiro garantidor | ausente |

## Novo / usado e zero km

| Tema | Live |
|---|---|
| Novo/usado | ausente |
| Zero km | visível, default Sim |
| Condicional Não | - UF da placa
- Placa
- RENAVAM

## Veículo (zero km = Sim)

- Chassi* (visual *)
- Situação do chassi
- N° gravame/restrição* (visual *)
- Veículo zero km?
- Ano fabricação
- Ano modelo
- UF licenciamento

## Obrigatórios visuais (casca)

- Destino: Destino*
- Agente financeiro: Agente financeiro*
- Agente financeiro: CNPJ*
- Agente financeiro: Nome*
- Contrato: Tipo de restrição*
- Contrato: Número do Contrato*
- Contrato: Data do contrato*
- Devedor: CPF / CNPJ*
- Devedor: Nome completo*
- Devedor: CEP*
- Devedor: Logradouro*
- Devedor: Número*
- Devedor: Bairro*
- Devedor: UF*
- Devedor: Cidade*
- Devedor: Telefone*

## Java vs live (recorte)

| Tema | Java | Live | Classe |
|---|---|---|---|
| Form | coluna existe | carrega | LIVE_DOM |
| TG | false | ausente | alinhado |
| INDICA_NOVO_USADO | só BA obrigatório na matriz | ausente | alinhado |

## Bloqueios

- Persistência (Salvar/Registrar/upload): não executada.
- Obrigatoriedade **funcional** (submit): BLOQUEADO.

