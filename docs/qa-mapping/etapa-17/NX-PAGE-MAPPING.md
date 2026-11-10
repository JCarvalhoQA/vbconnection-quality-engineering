# Mapeamento Nova UX — PAGE-03 a PAGE-08

**Não houve inspeção autenticada live** (`BLOCKED_SECURITY_CREDENTIAL_ROTATION`).
Rotas abaixo são as **pedidas** em `PAGE-INVENTORY.md` / `config/nxPages.ts`. `GET` HTTP direto `/vbconnection/*` = 404 Apache; navegação via `gotoApp` (`history.pushState`) — `CONFIRMED_BY_CODE` em `support/navigation.ts`.

PAGE-HOME = Home (`/vbconnection/home`, POM `homePage.ts`). PAGE-08 = imagem **por tela**. Sem colisão.

## Menu e permissões

| Item | Evidência NX | Confiança |
|---|---|---|
| Topo mockado | Início, Faturamento, Gerenciar Usuários, Legislação, vbPlay, vbChat + vbAuto | `CONFIRMED_BY_UI` (teste `menu-lateral.spec.ts`) |
| Atalho Registro de Contrato | Abre PAGE-02 | `CONFIRMED_BY_UI` |
| Entrada de aditivo / lote / imagem | **não** listada no smoke de menu | `UNKNOWN` |
| Menu Master | NÃO_ANALISADO | `UNKNOWN` |
| Roles mock | incluem `CONTRATO_EDITAR` e `IMAGEM`; **não** incluem `IMAGEM_UPLOAD` nem `ARQUIVOS_ENVIO` | `CONFIRMED_BY_CODE` (`support/auth.ts`) |

Se a NX exigir `IMAGEM_UPLOAD` para PAGE-07/08, a sessão mock atual **não** basta — depende de confirmação.

## PAGE-03 — Aditivo

| Campo | Valor | Origem |
|---|---|---|
| Rota pedida | `/vbconnection/contrato/aditivo/inserir` | PAGE-INVENTORY |
| Permissão v2 | `CONTRATO_EDITAR` | PAGE-INVENTORY |
| POM NX | ausente | — |
| Busca v2 | radio PROTOCOLO/CHASSI; `#protocoloAditivo` / `#chassiAditivo`; `focusout` | `aditivo-inserir.md` **v2** |
| Form | `*ngIf="contrato"` — inexistente ⇒ sem submit | v2 |
| Submit v2 | Registrar Aditivo | v2 |
| `TIPO_ADITIVO` | visível RR PR SC AC AP RS | matriz aditivo v2 |
| CT ligado | CT-064 | — |
| NX DOM | `NAO_MAPEADO` | — |

Locators v2 **não** copiar para spec NX.

## PAGE-04 — Aditivo RS

Rota `/vbconnection/contrato/aditivo-rs/inserir`. Destino `[disabled]="true"` no v2. Fora dos 15 negativos (CT-068 já mapeado positivo/estrutural). Sem POM NX.

## PAGE-05 — Contrato lote

| Campo | v2 | NX |
|---|---|---|
| Rota | `/vbconnection/contrato/lote` (v2 `arquivo/upload`) | não observada |
| Accept | txt, csv, xlsx, xls | `UNKNOWN` |
| Nome | alfanumérico; recusa espaço/hífen/underscore | `UNKNOWN` |
| Upload | `beforeUpload` retorna false; POST depois | persistGuard abortaria POST |
| Copy orientação | exemplos recusados no Gherkin `lote.md` | não vista na NX |
| CTs | CT-070, CT-072, CT-073 | — |

## PAGE-06 — Aditivo lote

Rota `/vbconnection/contrato/aditivo/lote`. Permissões v2 extras `ARQUIVOS_ENVIO`. Layout **inferido** como o do PAGE-05. CT-075. NX `UNKNOWN`.

## PAGE-07 — Imagem lote

Rota `/vbconnection/registrar/imagem/lote`. v2: ZIP, limit 1, nome alfanumérico. Role v2 `ImagemUpload`. CT-077. NX `UNKNOWN`.

## PAGE-08 — Imagem por tela

Rota `/vbconnection/registrar/imagem/tela`. v2: filtro protocolo vs contrato+chassi; PDF; limites MT 3,5 / SC 5 / MS 5 MB; copy `Documento para o estado de {{UF}}, não pode exceder {{n}} MB.` CTs 080–082. Divergência Java 4 MB / lote 12 MB. NX `UNKNOWN`.

## Chamadas de escrita (não executar)

Padrão `PERSIST_URL_PATTERN` aborta POST/PUT/PATCH/DELETE de contrato/aditivo/lote/imagem/upload/B3 no mocked (exceto fallback de `contratos/registrar`). Qualquer spec futura de PAGE-03…08 deve manter o guard e **não** clicar em processar/enviar real.

## NG-ZORRO esperado (inferido do restante da NX, não do DOM destas telas)

Datepicker, `nz-upload`, `nz-message`, `nz-select`, tabelas Ant. **INFERRED** até snapshot NX.
