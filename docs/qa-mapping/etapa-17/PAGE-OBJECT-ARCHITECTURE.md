# Arquitetura proposta de Page Objects — PAGE-03 a PAGE-08

**Não implementar POM sem DOM comprovado.** Nenhum arquivo vazio foi criado para essas telas.

## O que já existe (reutilizar)

```text
pages/
  common/formPage.ts          toast, fillNamed, fillNzDatePicker, articleByHeading
  common/menuAsideComponent.ts
  common/loaderComponent.ts
  common/modalComponent.ts
  common/headerComponent.ts
  fragments/veiculoSection.ts  só PAGE-02
  contratoPage.ts              PAGE-02
  contratoConsultarPage.ts     consulta
  homePage.ts                  PAGE-HOME
  loginPage.ts
support/
  persistGuard.ts
  navigation.ts                gotoApp
  contratoCadastroMocks.ts     form + registrar (PAGE-02)
config/
  nxPages.ts                   catálogo de rotas (esta etapa)
```

## Desenho alvo (quando o DOM NX existir)

```text
pages/
  aditivo/
    aditivoConsultaFragment.ts   radio protocolo/chassi, focusout, empty state
    aditivoInserirPage.ts        PAGE-03 — compõe consulta + seções reutilizadas
    aditivoRsInserirPage.ts      PAGE-04 — destino disabled; sem bloco de busca v2
  lote/
    uploadDropzoneFragment.ts    nz-upload, orientação de nome, lista local
    contratoLotePage.ts          PAGE-05
    aditivoLotePage.ts           PAGE-06 (reusa dropzone se a NX for a mesma)
  imagem/
    imagemLotePage.ts            PAGE-07 — ZIP limit 1
    imagemTelaPage.ts            PAGE-08 — busca + upload PDF limite UF
```

### Compartilhado

| Peça | Origem | Uso |
|---|---|---|
| `FormPage.toast()` | existente | erros/orientação |
| `LoaderComponent` | existente | loading destino/busca |
| `gotoApp` + `nxPageById().rota` | existente + catálogo | deep link cliente |
| `installPersistGuard` | existente | abortar POST de upload |
| Seções Agente/Veículo/Contrato/Devedor | **não** copiar `ContratoPage` até provar os mesmos `article`/headings no aditivo NX | — |

### Locators (política)

1. `getByRole` / label visível.
2. `data-testid` se o produto expor.
3. IDs estáveis só após inspeção NX (`#protocoloAditivo` é v2).
4. Proibido `nth-child` e IDs `*-veic-{timestamp}-*`.

### Upload

Arquivos **sintéticos** em memória (`Buffer`). `beforeUpload` / recusa local: assert UI. POST: deve ser abortado pelo guard — o teste afirma **não persistir**, não o processamento DETRAN.

## Helpers desta etapa (somente catálogo)

`config/nxPages.ts` + `tests/nxPages.test.ts`: sincroniza rotas com `PAGE-INVENTORY.md`; garante PAGE-03…08 com `pom: null`. Não é POM de tela.
