# CE — PAGE-02 Nova UX

**Evidência:** GATE2 · LIVE_DOM / LIVE_UI  
**id destinos-combo:** 236  
**Formulário:** disponível  
**Matriz Java:** sim · **Suíte Playwright:** não

## Seções

- Registrar contrato
- Destino
- Agente financeiro
- Veículos
- Contrato
- Devedor
- Credor
- Dados complementares
- Terceiro garantidor
- Documentos

## Contagens (casca)

| Métrica | Valor |
|---|---|
| Campos | 68 |
| Obrigatórios visuais | 25 |
| Credor | presente |
| Documentos | presente |
| Terceiro garantidor | 12 campos, 0 * visual |

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
- Ano fabricação* (visual *)
- Ano modelo
- Tipo espécie
- Marca / modelo

## Obrigatórios visuais (casca)

- Destino: Destino*
- Agente financeiro: Agente financeiro*
- Agente financeiro: CNPJ*
- Contrato: Tipo de restrição*
- Contrato: Número do Contrato*
- Contrato: Data do contrato*
- Contrato: Liberação de crédito*
- Contrato: Número de parcelas*
- Contrato: Venc. 1ª parcela*
- Contrato: Valor total financiamento*
- Contrato: Taxa juros mês (%)*
- Contrato: UF local de pagamento*
- Contrato: Cidade local de pagamento*
- Contrato: UF liberação crédito*
- Contrato: Cidade liberação crédito*
- Contrato: Data de pagamento*
- Contrato: Época de pagamento*
- Devedor: CPF / CNPJ*
- Devedor: Nome completo*
- Devedor: CEP*
- Devedor: Logradouro*
- Devedor: Bairro*
- Devedor: UF*
- Devedor: Cidade*
- Devedor: Celular*

## Java vs live (recorte)

| Tema | Java | Live | Classe |
|---|---|---|---|
| Form | coluna existe | carrega | LIVE_DOM |
| TG | true | visível | alinhado |
| INDICA_NOVO_USADO | só BA obrigatório na matriz | ausente | alinhado |

## Bloqueios

- Persistência (Salvar/Registrar/upload): não executada.
- Obrigatoriedade **funcional** (submit): BLOQUEADO.

