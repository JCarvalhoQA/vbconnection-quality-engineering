# Rondônia — inventário PAGE-02

**Status:** OBSERVADO LIVE  
**Data:** 2026-11-05  
**Destino:** DETRAN-RO (id 234)  
**Fonte:** `gate2-ro-page02-inventory.json` + linha de veículo  
**Casca:** 52 campos · **11** com `*` visual  
**Confiança:** CONFIRMADA_LIVE

RO é o formulário **mais enxuto** das três UFs na obrigatoriedade visual. Presença no combo ≠ suíte Playwright.

## Seções

Destino · Agente financeiro · Veículos · Contrato · Devedor · Credor · Dados complementares · Documentos

**Sem** Terceiro garantidor. **Sem** Aditivo nesta página.

## Destino / Agente

Igual CE na casca: Destino\* (disabled após seleção), Agente\*, Código DETRAN opcional, CNPJ\* disabled, Nome opcional disabled.

## Veículos (linha inline)

Zero km default **Sim**. `indicaNovoUsado` **ausente**. Sem Situação do chassi, sem Tipo espécie, sem Marca/modelo, sem Número motor.

| Nome | `formcontrolname` | Visual | Condicional |
|---|---|---|---|
| Chassi | `chassi` | `*` · max 21 | sempre |
| N° gravame/restrição | `restricao` | `*` · max 8 | sempre |
| Veículo zero km? | `veiculoZeroKm` | default Sim · Sim/Não | extra Nova UX |
| Ano fabricação | `ano` | **opcional** (sem `*`, diferente de CE) | sempre |
| Ano modelo | `modelo` | opcional | sempre |
| UF da placa | `uf` | opcional | zero km = Não |
| Placa | `placa` | opcional | zero km = Não |
| RENAVAM | `renavam` | opcional | zero km = Não |

Ações: Salvar visível **não clicado**; Cancelar ausente; Excluir veículo descartou a linha.

## Contrato — só 3 `*` além do Destino/Agente

Obrigatórios visuais: Tipo de restrição\* · Número do Contrato\* · UF liberação\* · Cidade liberação\*.

Opcionais (presentes): Tipo de Contrato, Data do contrato, Liberação de crédito, Início/Fim vigência, **Data assinatura**, Parcelas, Valor parcela, Vencimentos, IOF, Valor total, Comissão, Penalidade, Taxas juros, E-mail do contrato, Data do cadastro.

**Não** há na RO live: Data de pagamento, Época de pagamento, UF/Cidade local de pagamento.

Tipo de restrição: mesmas 4 opções da BA/CE.

Java RO: `DATA_CONTRATO` visível **opcional**, `VALOR_TOTAL` opcional, `NUMERO_PARCELAS` opcional — alinhado ao live (sem `*`). `TIPO_RESTRICAO` e `NUMERO` obrigatórios — alinhado.

## Devedor

Obrigatórios: CPF/CNPJ, Nome (max 40), UF, Cidade (disabled até UF).  
Opcionais: CEP, Logradouro, Número, Complemento, Bairro, Telefone, E-mail.  
**Sem** Celular (CE tem Celular\*).

Java RO: `END_UF`/`END_MUNICIPIO` obrigatórios; demais endereço visíveis opcionais; `CEL_*` ocultos — alinhado.

## Credor

Mesmos 9 campos da CE (inclui E-mail). **Nenhum** `*`.  
Java RO marca `END_UF` e `END_MUNICIPIO` como `[true, true]` — **INCOMPATÍVEL** com o live sem asterisco.

## Complementares

Cota, grupo, Índice (sem `*`), Taxa mora, **Valor TAC** (presente; Java `[true, false]`).  
Sem taxa multa / taxa administrativa da CE/BA.

## Documentos

Heading + dropzone. Upload não executado.

## Dependências

| Gatilho | Efeito |
|---|---|
| Destino RO | form sem TG |
| Zero km Não | UF placa + Placa + RENAVAM |
| UF devedor | habilita Cidade |
| Linha aberta | Adicionar veículo disabled |
