# PAGE-05 — Contratos em lote

Rota pedida: `/vbconnection/contrato/lote`. No v2 o upload está em `arquivo/upload` (`ContratoLoteFormComponent`), título `Registrar contrato lote`. Nova UX live **BLOQUEADO**.

## Arquivo (CONFIRMADO_CODIGO v2)

- Accept: `text/plain`, `.csv`, xlsx, xls. Texto da UI: “Arraste o arquivo .txt ou .csv aqui”.
- `nzMultiple=true`, `limit` via `showUploadList.limit`.
- Nome: só letras e números (`ORIENTACAO_NOME_ARQUIVO_LOTE`). Recusa espaço, hífen, underscore, acento.
- `beforeUpload` lê DataURL e **retorna false** (upload manual pelo botão).
- Botão Upload habilita conforme lista (`disableUpload` quando atinge o limite).
- Template: download “Manual de integração” / template padrão.
- Erro de leitura: “Ocorreu uma falha na conexão de internet ao realizar o upload…”.
- Remoção: `excluirArquivo` só tira da lista local.

Processamento, duplicidade, retorno e reprocessamento: **não exercitados** (proibido nesta etapa). Hipóteses em `scenarios/lote.md`.
