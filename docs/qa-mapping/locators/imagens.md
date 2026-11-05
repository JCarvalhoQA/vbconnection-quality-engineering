# Locators — imagens

| ID | Página | Nome | Tipo | Locator candidato | Confiança |
|---|---|---|---|---|---|
| LOC-IMGL-DROP | PAGE-07 | Drop ZIP | upload | texto "Arraste o arquivo .zip aqui" | CONFIRMADO_CODIGO v2 |
| LOC-IMGT-PROT | PAGE-08 | Nº do Protocolo | textbox | placeholder "Nº do Protocolo" | CONFIRMADO_CODIGO v2 |
| LOC-IMGT-CTR | PAGE-08 | Nº do Contrato | textbox | placeholder "Nº do Contrato" | CONFIRMADO_CODIGO v2 |
| LOC-IMGT-CHASSI | PAGE-08 | Nº do Chassi | textbox | placeholder "Nº do Chassi" | CONFIRMADO_CODIGO v2 |
| LOC-IMGT-SW | PAGE-08 | Mudar filtro | switch | `nz-switch` formControlName filtroProtocolo | CONFIRMADO_CODIGO v2 |
| LOC-IMGT-PESQ | PAGE-08 | Pesquisar | button | `getByRole('button', { name: 'Pesquisar' })` | CONFIRMADO_CODIGO v2 |
| LOC-IMGT-UP | PAGE-08 | Upload | button | `getByRole('button', { name: 'Upload' })` | CONFIRMADO_CODIGO v2 |
