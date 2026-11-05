# AC — PAGE-02 Nova UX

**Evidência:** GATE3 · LIVE_DOM / LIVE_UI  
**id destinos-combo:** 17  
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
| Campos | 49 |
| Obrigatórios visuais | 25 |
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
- Situação do chassi* (visual *)
- N° gravame/restrição* (visual *)
- Veículo zero km?
- Ano fabricação* (visual *)
- Ano modelo* (visual *)
- Marca / modelo
- Marca bem
- Modelo bem
- Versão modelo bem
- Combustível
- Categoria
- Cor
- UF licenciamento

## Obrigatórios visuais (casca)

- Destino: Destino*
- Agente financeiro: Agente financeiro*
- Agente financeiro: CNPJ*
- Agente financeiro: Nome*
- Contrato: Tipo de restrição*
- Contrato: Número do Contrato*
- Contrato: Data do contrato*
- Contrato: Liberação de crédito*
- Contrato: Número de parcelas*
- Contrato: Venc. 1ª parcela*
- Contrato: Venc. última parcela*
- Contrato: Valor total financiamento*
- Contrato: UF liberação crédito*
- Contrato: Cidade liberação crédito*
- Devedor: CPF / CNPJ*
- Devedor: Nome completo*
- Devedor: CEP*
- Devedor: Logradouro*
- Devedor: Número*
- Devedor: Complemento*
- Devedor: Bairro*
- Devedor: UF*
- Devedor: Cidade*
- Devedor: Telefone*
- Dados complementares: Índice*

## Java vs live (recorte)

| Tema | Java | Live | Classe |
|---|---|---|---|
| Form | coluna existe | carrega | LIVE_DOM |
| TG | false | ausente | alinhado |
| INDICA_NOVO_USADO | só BA obrigatório na matriz | ausente | alinhado |

## Bloqueios

- Persistência (Salvar/Registrar/upload): não executada.
- Obrigatoriedade **funcional** (submit): BLOQUEADO.

