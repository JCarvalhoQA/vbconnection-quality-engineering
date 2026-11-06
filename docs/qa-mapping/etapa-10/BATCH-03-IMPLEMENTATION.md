# Lote 3 — implementação

Specs: `e2e/contratos/page02/{pe,pr,rj,rn}-estrutural.spec.ts` via `definirTestesEstruturaisPage02`.

`VeiculoSection.expectCampoInventario` passa a validar `tipoEspecie` e `descricaoCorVeiculo` quando o inventário live os lista (PR/RJ espécie; RJ cor com `*`).

## Executado (mocked)

PAGE-02 lote 3: 4 passed (incluídos nos 15 estruturais mocked).

## Não executado

Live-readonly PE/PR/RJ/RN.
