# Locators — aditivo e aditivo RS

Candidatos a partir do HTML v2. **INFERIDO** para a Nova UX até inspeção autenticada.

| ID | Página | Nome | Tipo | Locator candidato | Confiança |
|---|---|---|---|---|---|
| LOC-ADT-PROT | PAGE-03 | Protocolo | textbox | `#protocoloAditivo` / getByPlaceholder('Protocolo') | CONFIRMADO_CODIGO v2 |
| LOC-ADT-CHASSI | PAGE-03 | Chassi busca | textbox | `#chassiAditivo` | CONFIRMADO_CODIGO v2 |
| LOC-ADT-RADIO | PAGE-03 | Tipo consulta | radio | `getByRole('radio', { name: 'PROTOCOLO' })` | CONFIRMADO_CODIGO v2 |
| LOC-ADT-SUBMIT | PAGE-03 | Registrar Aditivo | button | `getByRole('button', { name: 'Registrar Aditivo' })` | CONFIRMADO_CODIGO v2 |
| LOC-ADT-TIPO | PAGE-03 | Tipo de aditivo | select | seção Aditivo (matriz TIPO_ADITIVO) | CONFIRMADO_CODIGO matriz |
| LOC-ADTRS-DEST | PAGE-04 | Destino | combobox disabled | `app-destino-registro-form` | CONFIRMADO_CODIGO v2 |
