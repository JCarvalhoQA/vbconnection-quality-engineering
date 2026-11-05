# PAGE-07 — Imagens em lote

Rota pedida: `/vbconnection/registrar/imagem/lote`. v2: `imagem/lote`, título `Registro de imagem por lote`. Role `ImagemUpload`.

- Accept: ZIP (`FileType.Zip`).
- Texto: “Arraste o arquivo .zip aqui”.
- `limit: 1`.
- Nome do zip: mesma regra alfanumérica (`ORIENTACAO_NOME_ARQUIVO_ZIP`).
- Alerta v2 (tela individual, relacionado): nome do arquivo = chassi quando lote interno.

Associação contrato↔imagem e ZIP corrompido: **NÃO_ANALISADO** (não enviar ZIP real).
