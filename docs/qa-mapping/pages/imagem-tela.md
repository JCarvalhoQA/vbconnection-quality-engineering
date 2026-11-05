# PAGE-08 — Imagens por tela

Rota pedida: `/vbconnection/registrar/imagem/tela`. v2: `imagem/criar`.

## Busca

- Switch `filtroProtocolo`: protocolo **ou** (nº contrato + chassi).
- Botão Pesquisar (`type=submit`).
- Depois: `app-contrato-visualizar` + `app-upload-arquivo` `limite=1`.

## Arquivo

- PDF (`FileType.PDF`).
- Nome sem espaço/acento/especial.
- Limites por UF (`upload-limits.ts`, espelha backend): **SC 5 MB**, **MS 5 MB**, **MT 3,5 MB** na tela (backend lote MT até 4 MB e comprime). Demais UFs: 0 = sem limite de front; fallback de label 5 MB.
- Mensagem: `Documento para o estado de {{UF}}, não pode exceder {{n}} MB.`

Substituição/remoção e “obrigar novo anexo após remover”: **NÃO CONFIRMADO** (não excluir documentos persistidos). Candidato a teste em homologação com contrato descartável.
