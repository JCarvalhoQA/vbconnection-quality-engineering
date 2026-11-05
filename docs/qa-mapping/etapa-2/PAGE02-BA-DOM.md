# Gate 0 — DOM PAGE-02 Bahia (live)

**Status:** OBSERVADO (casca + seções; modal de veículo não aberto)  
**Data:** 2026-11-05  
**URL:** `https://newfront.vbconnection.info/vbconnection/contrato/inserir`  
**Fonte:** `page02-ba-inventory.json` + HTML/PNG sanitizados em `evidence/live/`  
**Confiança:** CONFIRMADO_TESTE

## Seções (headings)

1. Registrar contrato  
2. Destino (DETRAN-BA selecionado)  
3. Agente financeiro  
4. Veículos (tabela vazia; botão Adicionar veículo visível)  
5. Contrato  
6. Devedor  
7. Credor  
8. Dados complementares  
9. Documentos  

Não houve heading de Terceiro garantidor nem de Aditivo nesta página.

## Componentes Angular observados

- `nz-select` (Destino, Agente, UFs, cidades, tipo de restrição)
- `nz-date-picker` (Data do contrato, Liberação de crédito, vencimentos)
- `input` texto/máscara (CNPJ, contrato, valores, endereço)
- Overlay de carregamento no Agente (“Carregando…”) no screenshot; o inventário foi coletado após headings Agente/Veículos visíveis

## Campos

**47** nós de campo no DOM. **23** com obrigatoriedade visual (`*` ou `requiredVisual`).

Obrigatórios visuais: Destino, Agente financeiro, CNPJ (agente), Tipo de restrição, Número do Contrato, Data do contrato, Liberação de crédito, Número de parcelas, Venc. 1ª parcela, Venc. última parcela, Valor total financiamento, UF/Cidade liberação crédito, CPF/CNPJ (devedor), Nome completo, CEP/Logradouro/Número/Bairro/UF/Cidade (devedor), Telefone (devedor), Índice.

Chassi / Novo-usado / ano de fabricação: **não inspecionados** — exigiria clicar em Adicionar veículo (modal). Fora desta captura de casca.

## Persistência

Nenhum campo foi submetido. Botão Registrar contrato permaneceu visível/habilitado e **não clicado**.
