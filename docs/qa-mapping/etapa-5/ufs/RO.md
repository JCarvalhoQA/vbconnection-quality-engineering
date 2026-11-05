# RO — PAGE-02 Nova UX

**Evidência:** GATE2 · LIVE_DOM / LIVE_UI  
**id destinos-combo:** 234  
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
- Documentos

## Contagens (casca)

| Métrica | Valor |
|---|---|
| Campos | 52 |
| Obrigatórios visuais | 11 |
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
- N° gravame/restrição* (visual *)
- Veículo zero km?
- Ano fabricação
- Ano modelo

## Obrigatórios visuais (casca)

- Destino: Destino*
- Agente financeiro: Agente financeiro*
- Agente financeiro: CNPJ*
- Contrato: Tipo de restrição*
- Contrato: Número do Contrato*
- Contrato: UF liberação crédito*
- Contrato: Cidade liberação crédito*
- Devedor: CPF / CNPJ*
- Devedor: Nome completo*
- Devedor: UF*
- Devedor: Cidade*

## Java vs live (recorte)

| Tema | Java | Live | Classe |
|---|---|---|---|
| Form | coluna existe | carrega | LIVE_DOM |
| TG | false | ausente | alinhado |
| INDICA_NOVO_USADO | só BA obrigatório na matriz | ausente | alinhado |

## Bloqueios

- Persistência (Salvar/Registrar/upload): não executada.
- Obrigatoriedade **funcional** (submit): BLOQUEADO.

