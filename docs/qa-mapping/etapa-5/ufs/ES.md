# ES — PAGE-02 Nova UX

**Evidência:** GATE3 · LIVE_DOM / LIVE_UI  
**id destinos-combo:** 230  
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
- Terceiro garantidor
- Documentos

## Contagens (casca)

| Métrica | Valor |
|---|---|
| Campos | 58 |
| Obrigatórios visuais | 21 |
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
- N° gravame/restrição
- Veículo zero km?
- Ano fabricação
- Ano modelo
- Marca / modelo
- UF licenciamento

## Obrigatórios visuais (casca)

- Destino: Destino*
- Agente financeiro: Agente financeiro*
- Agente financeiro: CNPJ*
- Agente financeiro: Nome*
- Contrato: Número do Contrato*
- Contrato: Número de parcelas*
- Contrato: Venc. 1ª parcela*
- Contrato: IOF*
- Contrato: Valor total financiamento*
- Contrato: Taxa juros mês (%)*
- Contrato: Taxa juros ano (%)*
- Devedor: CPF / CNPJ*
- Devedor: Nome completo*
- Devedor: CEP*
- Devedor: Logradouro*
- Devedor: Número*
- Devedor: Bairro*
- Devedor: UF*
- Devedor: Cidade*
- Devedor: Telefone*
- Dados complementares: Índice*

## Java vs live (recorte)

| Tema | Java | Live | Classe |
|---|---|---|---|
| Form | coluna existe | carrega | LIVE_DOM |
| TG | true | visível | alinhado |
| INDICA_NOVO_USADO | só BA obrigatório na matriz | ausente | alinhado |

## Bloqueios

- Persistência (Salvar/Registrar/upload): não executada.
- Obrigatoriedade **funcional** (submit): BLOQUEADO.

