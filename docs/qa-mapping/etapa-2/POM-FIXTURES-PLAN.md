# Plano de Page Objects e fixtures

Preservar: `gotoApp`, hide Blip, IDs `#devedor*`, `test.fixme` de recuperação, projetos docker/newfront, intercept de registrar, `FormPage.selectOption`.

Não reescrever `ContratoPage` do zero. Estender.

## Estado atual (reuso)

```
pages/
  loginPage.ts              KEEP
  recuperacaoSenhaPage.ts   KEEP
  homePage.ts               KEEP
  contratoPage.ts           KEEP + tornar asserts de campo dependentes da fixture
  contratoConsultarPage.ts  KEEP
  clienteListPage.ts        KEEP
  common/formPage.ts        KEEP (Tab em data, overlay NZ)
  common/headerComponent.ts KEEP
  common/menuAsideComponent.ts KEEP
actions/contratoActions.ts  KEEP; happy path lê fixture para saber o que preencher
support/contratoCadastroMocks.ts  SUBSTITUIR constantes globais por loader de fixture (após aprovação)
config/detransIds.ts        KEEP metadados (alerta, webpki, ids); NÃO usar como matriz de campos
```

## Alvo incremental (após aprovação)

```
pages/
  contrato/
    contratoInserirPage.ts      # fachada atual (renomear opcional; evitar big-bang)
    sections/
      destinoSection.ts
      agenteSection.ts
      veiculoModal.ts
      contratoCampos.ts
      devedorSection.ts         # já ancorado em app-contrato-cadastro-devedor-section
      credorSection.ts          # NOVO quando DOM existir
      complementarSection.ts    # NOVO
      terceiroGarantidorSection.ts  # NOVO; só UFs CE ES PR RJ
  aditivo/
    aditivoInserirPage.ts       # NOVO após dump NX
    aditivoRsPage.ts
  lote/
    contratoLotePage.ts
    aditivoLotePage.ts
  imagens/
    imagemLotePage.ts
    imagemTelaPage.ts
fixtures/
  matriz/{UF}.json              # gerado de matriz-form.json
  login.mass.json               # KEEP; Master só via .env
support/
  matrizLoader.ts               # lê JSON; skip SE
  persistGuard.ts               # abort POST mutáveis em projeto live
```

## Contratos internos

**Page Object:** só locators + ações de UI (click, fill, select). Sem `expect` de regra de negócio, exceto waits de visibilidade do próprio controle.

**Actions:** orquestra e faz asserts (`validarCamposObrigatorios(config, fixture)`).

**Fixture UF:** única fonte de visível/obrigatório nos testes mockados.

**Teste:** um concern por spec. Os wrappers `{uf}.spec.ts` continuam; o `definirTestesRegistroContrato` passa a receber a fixture. UFs sem fixture Java (`SE`) → `test.skip` com motivo, não mock inventado.

## Independência e paralelo

- Mockados: `fullyParallel` como hoje.
- Live readonly: `workers: 1`, `storageState` compartilhado, **zero** POST.
- Sem dependência de contrato criado no teste anterior.
- Massa: factory + relógio; chassi único por execução, ainda assim **sem** bater DETRAN real.

## Filtros

Já existem `@contrato @ba @smoke`. Acrescentar (quando implementar): `@mocked` `@live-readonly` `@p0` `@matriz`.

Não criar pasta paralela de testes que duplique `e2e/contratos/registro`.

## Ordem de extração de seções

1. Destino + agente (já estáveis).
2. Devedor (IDs prefixados — não mexer no seletor).
3. Modal veículo (escopar Salvar/Chassi).
4. Contrato campos **condicionais** (tipo/data).
5. Credor / complementar / TG — só após dump DOM.
6. Aditivo — só após dump PAGE-03.

## O que não fazer no primeiro PR de implementação

- Apagar os 19 wrappers.
- Converter Cypress.
- `waitForTimeout`.
- Gravar `storageState` no git.
- Implementar CE/RO/SE como “mais do mesmo”.
- Gerar 40 specs novo/usado.
