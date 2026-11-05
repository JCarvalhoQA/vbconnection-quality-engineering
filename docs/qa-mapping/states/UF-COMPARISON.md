# Matriz comparativa de campos (CONFIRMADO_CODIGO)

Legenda: **Obrig.** = visível e obrigatório na matriz Java (`Boolean[]{true, true}`). **Opcional** = visível não obrigatório. **Oculto** = não exibe. **—** = UF sem linha na tabela daquele campo.

Fonte: `MatrizDados*.java`. Isto **não** foi revalidado no DOM live do newfront.

Playwright mock atual trata chassi/tipo/número/data/devedor documento+nome+endereço como obrigatórios **iguais para todas as UFs** — diverge desta matriz (ex.: agente `NOME` opcional em BA, MT, RO, CE; `ANO_FABRICACAO` varia).

| Campo | AC | AP | BA | CE | DF | ES | MG | MS | MT | PB | PE | PR | RJ | RN | RO | RR | RS | SC | SP | TO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| agente.NOME | Obrig. | Obrig. | Opcional | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| agente.NUMERO_DOCUMENTO | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| agente.CODIGO_DETRAN | Opcional | Opcional | Oculto | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Oculto | Opcional | Opcional |
| veiculo.NUMERO_CHASSI | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| veiculo.RENAVAM | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional |
| veiculo.PLACA | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional |
| veiculo.PLACA_UF | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional |
| veiculo.ANO_FABRICACAO | Obrig. | Obrig. | Oculto | Opcional | Opcional | Opcional | Obrig. | Opcional | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Opcional | Obrig. | Obrig. | Opcional |
| veiculo.ANO_MODELO | Obrig. | Obrig. | Oculto | Opcional | Opcional | Opcional | Obrig. | Opcional | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Opcional | Obrig. | Obrig. | Opcional |
| veiculo.INDICA_NOVO_USADO | Oculto | Oculto | Obrig. | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto |
| veiculo.REMARCADO | Obrig. | Obrig. | Oculto | Opcional | Oculto | Opcional | Obrig. | Opcional | Oculto | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Oculto | Obrig. | Opcional | Obrig. | Obrig. | Opcional |
| veiculo.MARCA | Opcional | Opcional | Oculto | Opcional | Opcional | Opcional | Opcional | Opcional | Opcional | Oculto | Oculto | Opcional | Opcional | Opcional | Oculto | Opcional | Opcional | Oculto | Oculto | Oculto |
| contrato.TIPO_CONTRATO | Oculto | Oculto | Oculto | Opcional | Opcional | Opcional | Oculto | Oculto | Opcional | Oculto | Oculto | Opcional | Opcional | Oculto | Opcional | Oculto | Opcional | Oculto | Oculto | Oculto |
| contrato.NUMERO | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| contrato.DATA_CONTRATO | Obrig. | Obrig. | Obrig. | Obrig. | Oculto | Oculto | Obrig. | Obrig. | Oculto | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| contrato.VALOR_TOTAL | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Opcional |
| contrato.NUMERO_PARCELAS | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Opcional |
| devedor.NUMERO_DOCUMENTO | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| devedor.NOME | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| devedor.END_CEP | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| devedor.END_UF | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| devedor.EMAIL | Oculto | Oculto | Oculto | Opcional | Oculto | Opcional | Oculto | Oculto | Opcional | Oculto | Oculto | Oculto | Oculto | Oculto | Opcional | Oculto | Opcional | Oculto | Opcional | Oculto |
| credor.END_CEP | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Opcional | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. | Opcional | Obrig. | Obrig. | Obrig. | Obrig. | Obrig. |
| credor.EMAIL | Opcional | Opcional | Oculto | Opcional | Oculto | Oculto | Opcional | Oculto | Opcional | Oculto | Oculto | Oculto | Oculto | Oculto | Opcional | Opcional | Obrig. | Oculto | Opcional | Oculto |
| aditivo.TIPO_ADITIVO | Opcional | Opcional | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Opcional | Oculto | Oculto | Oculto | Opcional | Opcional | Opcional | Oculto | Oculto |
| aditivo.ADITIVO_NUMERO | Opcional | Opcional | Opcional | Opcional | Oculto | Opcional | Obrig. | Opcional | Obrig. | Obrig. | Opcional | Opcional | Oculto | Obrig. | Oculto | Opcional | Opcional | Obrig. | Obrig. | Opcional |
| aditivo.ADITIVO_DATA | Opcional | Opcional | Opcional | Opcional | Oculto | Opcional | Obrig. | Opcional | Obrig. | Obrig. | Opcional | Opcional | Oculto | Obrig. | Opcional | Opcional | Opcional | Obrig. | Obrig. | Oculto |
| terceiro_garantidor.NOME | Oculto | Oculto | Oculto | Opcional | Oculto | Opcional | Oculto | Oculto | Oculto | Oculto | Oculto | Opcional | Opcional | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto | Oculto |

SE não entra nesta tabela. CE e RO entram embora o pedido original não os listasse.
