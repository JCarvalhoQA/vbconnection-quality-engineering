# PAGE-04 — Aditivo RS

URL: `/vbconnection/contrato/aditivo-rs/inserir`  
Título v2: `Registro de Aditivo – DETRAN RS`. Componente `AditivoFormRsComponent`. `selectMenu = NovoAditivoRS`. `getDetranRS()`.

## Diferenças reais vs PAGE-03 (código v2)

| Tema | PAGE-03 | PAGE-04 |
|---|---|---|
| Destino | editável (`app-destino-registro-form`) | `[disabled]="true"` |
| Busca protocolo/chassi | sim, antes do form | form já montado (sem o bloco de consulta do PAGE-03 no topo do template RS) |
| Menu | registro genérico | `RegistrarRadioEnum.NovoAditivoRS` |
| Matriz | campos aditivo RS: tipo visível, número/data visíveis **não obrigatórios** | mesma matriz UF=RS |

Live **BLOQUEADO**. Reenvio / restrições DETRAN-RS: **NÃO_ANALISADO** no front; há jobs batch `BuscarRetornoEtapaAtualDetranRSService` no backend — fora desta auditoria de UI.
