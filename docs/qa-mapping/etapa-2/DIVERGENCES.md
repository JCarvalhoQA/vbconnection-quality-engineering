# Divergências — Java × mock Playwright × Nova UX

Atualizado em 2026-11-05 após E2-04..07.

```
Matriz Java  →  GET /api/form/{secao}/detran/{id}   CONFIRMADO_CODIGO
Mock E2E     →  fixtures/matriz/{UF}.json           alinhado à Java (0 mismatches)
Nova UX      →  newfront PAGE-02                    CONFIRMADO_TESTE só com mock; live BLOQUEADO (sem Master)
```

## 1. Mock × Java (payload)

`docs/qa-mapping/evidence/mock-vs-java.json`:

- **0** células com status diferente
- **0** células Java ausentes no mock
- **0** extras no mock
- SE sem fixture (skip)
- CE/RO gerados, fora da suíte

A homogeneidade global `CAMPOS_*` foi eliminada. Cada UF usa a própria matriz.

## 2. O que os testes passam a significar

`validarCamposObrigatorios` e a factory **não** marcam Tipo de Contrato nem Novo/Usado como obrigatórios universais.

| Campo | Antes (mock global) | Agora |
|---|---|---|
| `TIPO_CONTRATO` | sempre obrigatório | oculto SP/BA/…; opcional PR/RJ/ES/RS/DF/MT |
| `INDICA_NOVO_USADO` | opcional em todas | **obrigatório só BA** |
| `ANO_FABRICACAO` | preenchido sempre | oculto em BA; obrigatório onde a Java manda |
| `DATA_CONTRATO` | sempre | oculto ES/DF/MT |
| `DADOS_TERCEIRO_GARANTIDOR` | omitido | true em PR/RJ/ES (e CE no JSON) |

## 3. Nova UX — evidência

O bundle publicado **consome** GET `/api/form` (PAGE-02 mudou ao trocar o mock). Isso é evidência de **integração mockada**, não de homologação live nem de “compatível com a Nova UX” como produto.

Não afirmamos paridade live. Fonte Nova UX continua fora do git.

## 4. Lacunas que restam

- DF happy path mockado: `DATA_PAGAMENTO` retém valor via `fillNzDatePicker` (3/3 + bateria). Paridade live ainda não evidenciada.
- POM ainda é PAGE-02; aditivo/lote/imagem não implementados.
- CE/RO aguardam destinos-combo live (E2-19).
- IDs HMG vs PRD inalterados.
- Gate 0 live não executado (sem autorização / Master no `.env`).
