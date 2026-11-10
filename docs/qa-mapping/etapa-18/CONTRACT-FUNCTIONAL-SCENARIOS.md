# Cenários funcionais — registro de contrato

UF de implementação nova: **BA** (Confluence DETRAN-BA). As 18 UFs do flow não foram clonadas.

| ID | Tipo | Regra | Spec | Assertions |
|---|---|---|---|---|
| CT-047 | Positivo | POST registrar com chassi e número; toast de sucesso | `contrato-positivo.spec.ts` | método POST, URL `contratos/registrar`, corpo contém chassi e número, HTTP 200, `protocolo`, `status=RECEBIDO`, “Contrato registrado com sucesso.” |
| CT-053 | Exceção | 400 e 503 sem sucesso | `contrato-excecoes.spec.ts` | status interceptado, sem toast de sucesso, permanece PAGE-02, número preservado |
| CT-084 | Negativo | Gravame maxlength 8 | `contrato-negativo.spec.ts` | atributo 8, fill 9 dígitos → 8, sem sucesso de registro |
| CT-085 | Negativo | Parcelas sem `-` | `contrato-negativo.spec.ts` | valor após blur sem hífen |
| CT-086 | Negativo | Financiamento sem `-` | `contrato-negativo.spec.ts` | valor após blur sem hífen |

Já cobertos (não duplicados): CT-045/046 × 18 UFs; CT-052 Tab; CT-053 500; estrutural 21 UFs.

Não implementados (regra Confluence sem comportamento NX comprovado ou copy): chassi inválido (CT-050), CPF (CT-051), datas parcela, ano ±1, B3 (CT-057), duplicidade (CT-060).
