# Estados (UF) — registro de contrato

## Três listas que não coincidem

| Lista | UFs |
|---|---|
| Pedido / Playwright 19 | AC, AP, BA, DF, ES, MG, MS, MT, PB, PE, PR, RJ, RN, RR, RS, SC, SE, SP, TO |
| Matriz Java `DETRAN` de formulário | AC, AP, BA, CE, DF, ES, MG, MS, MT, PB, PE, PR, RJ, RN, RO, RR, RS, SC, SP, TO |
| Só no Java (fora do pedido) | CE, RO |
| Só no pedido/Playwright | SE |

Cada UF Java tem arquivo próprio. **SE** tem arquivo declarando ausência na matriz.

Etapa **Envio B3**: não mapeada no backend de formulário. **Terceiro garantidor** não estava no enunciado e aparece em CE, ES, PR, RJ.

O `GET /api/form/detran/{id}` marca `DADOS_ADITIVO=true` quando algum campo de aditivo é visível. Isso **não** significa que a tela de **inserir contrato** mostre a seção Aditivo — o flag alimenta principalmente PAGE-03/04. Nos arquivos por UF a seção aparece como “visível na matriz”, com essa ressalva.

IDs HMG usados no Playwright (quando divergem de PRD): ver `detransIds.ts` e `DetranNumeroEnum` (RS 231 HMG / 23 PRD, etc.).
