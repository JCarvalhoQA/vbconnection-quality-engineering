# Validação de `ci-select.mjs` e da suíte live estrutural

Script: `scripts/ci-select.mjs`  
Playwright: `^1.55.0` · projeto `vbconnection-newfront` · baseURL `https://newfront.vbconnection.info`

## Mapeamento mode × suite → args

| Mode | Suite | Args |
|---|---|---|
| `live-readonly` | `structural` | `--project=vbconnection-newfront e2e/contratos/page02 --grep @live-readonly` |
| `live-readonly` | `smoke` | idem structural (ramo `else`: só `page02` + `@live-readonly`) |
| `live-readonly` | `regression` | `--project=vbconnection-newfront --grep @live-readonly` |
| `mocked` | `regression` | `--project=vbconnection-newfront --grep-invert @live-readonly` |
| `mocked` | `structural` | `--project=vbconnection-newfront e2e/contratos/page02 --grep @mocked` |
| `mocked` | `smoke` | `--project=vbconnection-newfront --grep @smoke --grep-invert @live-readonly` |

Rejeições (exit 2), comprovadas localmente:

| Caso | Mensagem |
|---|---|
| `GITHUB_EVENT_NAME=pull_request` + live | `live-readonly is not available on pull requests.` |
| `PLAYWRIGHT_TARGET=hmg` | homologação serve site institucional; usar `newfront` |
| live sem `PLAYWRIGHT_MASTER_USER/PASSWORD` | exige credenciais do Environment `live-readonly` |
| mode/suite/target fora da allowlist | `not authorized` |

## `playwright test --list` (sem executar)

### Live estrutural (args reais do `ci-select`)

```text
npx playwright test --list --project=vbconnection-newfront e2e/contratos/page02 --grep "@live-readonly"
```

```text
[vbconnection-newfront] › contratos\page02\ba-estrutural.spec.ts:69:7
  PAGE-02 BA estrutura visual @contrato @page02 @ba @live-readonly
  › valida casca, linha de veículo, zero km e descarte sem Registrar
Total: 1 test in 1 file
```

- Não inclui o describe `@mocked` do mesmo arquivo.
- Não inclui `e2e/contratos/registro/*` (registro efetivo mockado).
- Não inclui Gates 0–3 (`e2e/gate0` … `e2e/gate3`).
- `target=newfront` seleciona o projeto cuja URL é a Nova UX.

O `test.skip(!LIVE)` do describe live é runtime. Com ou sem `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1`, o `--list` mostra 1 teste. O workflow seta a flag para `1` no job live antes do run; sem a flag o teste seria skipped em runtime, não omitido do filtro.

### Mocked estrutural (não mistura live)

```text
npx playwright test --list --project=vbconnection-newfront e2e/contratos/page02 --grep "@mocked"
```

```text
[vbconnection-newfront] › contratos\page02\ba-estrutural.spec.ts:42:7
  PAGE-02 BA estrutura visual @contrato @page02 @ba @mocked
  › carrega o formulário, inspeciona veículo e descarta a linha sem persistir
Total: 1 test in 1 file
```

### Live regression (não usado neste disparo)

`--grep @live-readonly` lista 6 testes / 5 arquivos: piloto PAGE-02 BA + Gate 0 + Gate 1 + Gate 2 (CE, RO) + Gate 3 (19 UFs). Fora do escopo `suite=structural`.

### Filtro vazio não passa silenciosamente

```text
npx playwright test --list --project=vbconnection-newfront --grep "@no-such-tag-xyz-live"
Error: No tests found
exit 1
```

Playwright 1.55 desta suíte **não** expõe `--fail-on-empty`. O default já falha quando o grep não encontra testes. `--pass-with-no-tests` **não** é usado no workflow.

## PAGE-02 BA no conjunto estrutural live

O único spec em `e2e/contratos/page02/` é `ba-estrutural.spec.ts`. O teste live:

1. Autentica Master (sem mock de login).
2. Abre PAGE-02, confirma destino BA em `destinos-combo`.
3. Valida seções e obrigatoriedades visuais.
4. Abre linha de veículo, zero km, placa/RENAVAM condicionais.
5. Descarta a linha sem salvar / sem Registrar.

Não depende dos mocks de contrato para validar a casca live (`mockContratoCadastroApis` só no describe `@mocked`).

## CI da regressão mockada (contraprova de filtro)

Run `42074098852` attempt 2, step *Validate suite selection*:

```text
args=--project=vbconnection-newfront --grep-invert @live-readonly
mode=mocked
suite=regression
```

80 passed, 3 skipped, 0 failed. Os `@live-readonly` ficaram de fora do conjunto, não “skipped dentro da suíte mockada”.
