# Ceará — inventário PAGE-02

**Status:** OBSERVADO LIVE  
**Data:** 2026-11-05  
**Destino:** DETRAN-CE (id 236)  
**Fonte:** `gate2-ce-page02-inventory.json` + linha de veículo  
**Casca:** 68 campos · **25** com `*` visual  
**Confiança:** CONFIRMADA_LIVE

Valores de Credor/Agente/sessão não documentados.

## Seções

Destino · Agente financeiro · Veículos · Contrato · Devedor · Credor · Dados complementares · **Terceiro garantidor** · Documentos

## Destino / Agente

| Nome | `formcontrolname` | id | Tipo | Visual |
|---|---|---|---|---|
| Destino | `destino` | `destino` | `nz-select` | `*` · disabled após seleção |
| Agente financeiro | `agenteFinanceiro` | `agenteFinanceiroCadastro` | `nz-select` | `*` |
| Código DETRAN | `codigo` | `codigoAgenteFinanceiro` | input | opcional (ausente na BA) |
| CNPJ | `cnpj` | `cnpjAgenteFinanceiro` | input | `*` · disabled |
| Nome | `nome` | `nomeAgenteFinanceiro` | input | opcional · disabled |

## Veículos (linha inline)

Zero km default **Sim**. `indicaNovoUsado` **ausente**. Sem Cancelar. Descarte: **Excluir veículo**. Adicionar veículo disabled com linha aberta.

| Nome | `formcontrolname` | Visual | Condicional |
|---|---|---|---|
| Chassi | `chassi` | `*` · max 21 | sempre |
| Situação do chassi | `tipoChassi` | opcional | sempre (Java `REMARCADO`) |
| N° gravame/restrição | `restricao` | `*` · max 8 | sempre |
| Veículo zero km? | `veiculoZeroKm` | opcional · default Sim · Sim/Não | extra Nova UX |
| Ano fabricação | `ano` | **`*`** | sempre |
| Ano modelo | `modelo` | opcional | sempre |
| Tipo espécie | `tipoEspecie` | opcional | sempre |
| Marca / modelo | `idMarcaModelo` | opcional | sempre |
| UF da placa | `uf` | opcional | só se zero km = Não |
| Placa | `placa` | opcional | só se zero km = Não |
| RENAVAM | `renavam` | opcional | só se zero km = Não |

Ausentes vs BA: Novo/usado, Número motor.  
Ausentes vs Java visível: nenhum dos 8+3 acima faltou; motor Java oculto — alinhado.

## Contrato (obrigatórios visuais)

Tipo de restrição\* · Número do Contrato\* · Data do contrato\* · Liberação de crédito\* · Número de parcelas\* · Venc. 1ª parcela\* · Valor total\* · Taxa juros mês (%)\* · UF/Cidade local de pagamento\* · UF/Cidade liberação\* · Data de pagamento\* · Época de pagamento\*

Opcionais visíveis: Tipo de Contrato, Início/Fim vigência, Valor parcela, Venc. última, IOF, Comissão, Penalidade, Taxa juros ano, Data do cadastro.

Tipo de restrição (opções): Arrendamento mercantil, Reserva domínio, Alienação fiduciária, Penhor.

## Devedor

Obrigatórios: CPF/CNPJ, Nome (max 40), CEP, Logradouro, Bairro, UF, Cidade (disabled até UF), **Celular**.  
Opcionais: Número, Complemento, Telefone, E-mail.  
Número de endereço **não** tem `*` (Java `END_NUMERO` opcional).

## Credor

CEP, Logradouro, Número, Complemento, Bairro, UF, Cidade, Telefone, **E-mail** (max 200). Todos **sem** `*`. Java CE: visíveis opcionais — alinhado na obrigatoriedade visual.

## Complementares

Cota/grupo (max 6), Índice (**sem** `*`, diferente da BA), Taxa mora, Taxa multa, Taxa administrativa. Sem Fundo de reserva. Sem Taxa contrato da BA.

## Terceiro garantidor

12 campos, **nenhum** `*`. Ver [THIRD-PARTY-GUARANTOR.md](./THIRD-PARTY-GUARANTOR.md). Não preenchidos.

## Documentos

Heading + dropzone (“Arraste a Imagem…”). Upload **não** executado.

## Dependências observadas

| Gatilho | Efeito |
|---|---|
| Destino CE | form completo + TG |
| Destino locked | **Alterar destino** (não usado após CE) |
| UF devedor / TG | habilita Cidade |
| Zero km Não | UF placa + Placa + RENAVAM |
| Linha veículo aberta | Adicionar veículo disabled |
