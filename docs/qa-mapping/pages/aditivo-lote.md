# PAGE-06 — Aditivos em lote

Rota: `/vbconnection/contrato/aditivo/lote`. Permissões v2: `ContratoEditar`, `ArquivoEnvio`, `ArquivoEnvioContigenciaB3`.

UI muito próxima do lote de contratos: drag `.txt`/`.csv`, template, Upload, progresso, exclusão local.

Diferença a confirmar na Nova UX: se o layout de aditivo é o mesmo arquivo com outro endpoint. **INFERIDO**.

Validações por registro (contrato inexistente, inelegível, tipo de aditivo): servidor — **NÃO_ANALISADO** sem processar arquivo.
