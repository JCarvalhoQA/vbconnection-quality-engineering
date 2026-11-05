# Mocks e fixtures por UF (E2-04..07)

Implementado. Geração:

```powershell
cd auto.ui/playwright
npm run matriz:generate   # fixtures/matriz/{UF}.json + todas.json
npm run matriz:compare    # docs/qa-mapping/evidence/mock-vs-java.json
```

## Onde o mock lê a matriz

`mockContratoCadastroApis(page, uf)` → `loadMatrizFixture(uf)` → respostas:

| Endpoint | Fonte |
|---|---|
| `GET /form/detran/{id}` | `fixture.secoes` |
| `GET form/{secao}/detran/` | `fixture.campos[DADOS_*]` |
| `form/terceiroGarantidor` | `DADOS_TERCEIRO_GARANTIDOR` |
| `form/aditivo` | `DADOS_ADITIVO` |

`uf === 'SE'` lança `MatrizIndisponivelError`. Specs SE usam `test.skip` (`formularioIndisponivel`).

CE/RO têm JSON (`naSuitePlaywright: false`) e **não** entram no combo mockado nem no tipo `DetranUf`.

Constantes globais `CAMPOS_*` / `ETAPAS_REGISTRO` foram removidas.

## Contrato da fixture

```json
{
  "uf": "BA",
  "origem": "docs/qa-mapping/evidence/matriz-form.json",
  "fonteJava": "auto.core/.../formulario/matriz/MatrizDados*.java",
  "idHmg": 14,
  "naSuitePlaywright": true,
  "secoes": { "DADOS_TERCEIRO_GARANTIDOR": false, "DADOS_ADITIVO": true },
  "campos": { "DADOS_VEICULO": { "INDICA_NOVO_USADO": [true, true], "ANO_FABRICACAO": [false, false] } }
}
```

`[visivel, obrigatorio]` = `Boolean[]` Java.

## Persistência

`installPersistGuard` (último na LIFO): aborta mutações de lote/aditivo/imagem/B3/contratos; `POST contratos/registrar` faz `fallback()` para o mock.

## O que o mock não finge

- Destino SE com formulário válido.
- Envio DETRAN/B3 real.
- CE/RO no destinos-combo.
- Paridade comprovada com a Nova UX live.
