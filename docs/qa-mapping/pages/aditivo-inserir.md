# PAGE-03 — Registro de aditivo

URL: `/vbconnection/contrato/aditivo/inserir`  
Fonte: `contrato-routing.module.ts` + `aditivo-form.component.html` (v2). Nova UX live: **BLOQUEADO**. POM: inexistente.

## Busca do contrato original (CONFIRMADO_CODIGO v2)

- Radio `tipoConsulta`: `PROTOCOLO` | `CHASSI`.
- Campos `#protocoloAditivo` / `#chassiAditivo`, busca no `focusout`.
- Sem contrato localizado, o form de aditivo não renderiza (`*ngIf="contrato"`).

## Após localizar

Seções condicionadas por `contratoEtapa` (mesmo GET `/api/form/detran/{{id}}`): Destino, Aditivo, Agente, Veículos, Contrato, Devedor, Credor, Complementares, Terceiro garantidor, Documentos.

Botão submit: **Registrar Aditivo**.

Campos da matriz `MatrizDadosAditivo` (visibilidade por UF): `TIPO_ADITIVO`, `ADITIVO_NUMERO`, `ADITIVO_DATA`, `ADITIVO_NUMERO_REGISTRO`, `NO_REGISTRO_ADITIVO_SIRCOF`.

`TIPO_ADITIVO` visível em RR, PR, SC, AC, AP, RS. Oculto em SP, MG, RJ, PE, PB, BA, TO, MS, RN, ES, DF, MT, RO, CE.

Desabilitações específicas no HTML: `disabledInputSC`, `disabledInputSP`, `disabledInputPB=true` no form padrão de aditivo.

Regras de elegibilidade do contrato original, duplicidade e mensagens de erro de API: **NÃO_ANALISADO** (sem sessão e sem teste).
