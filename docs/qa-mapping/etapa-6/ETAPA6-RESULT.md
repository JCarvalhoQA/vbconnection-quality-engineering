# Etapa 6 — Arquitetura Playwright PAGE-02 (piloto BA)

**Status:** infraestrutura publicada neste repositório (raiz Playwright). Piloto `@live-readonly` BA executado após autorização (passed, 11,7s).  
**Escopo:** estrutura da PAGE-02, começando pela Bahia. Sem registro real. Sem PAGE-03..08.

Paths abaixo usam a raiz de `vbconnection-quality-engineering` (não `auto.ui/playwright`).

## Arquivos criados

| Arquivo | Papel |
|---|---|
| `auto.ui/playwright/support/ufUiProfile.ts` | Perfil visual por UF a partir de `LIVE-FIELD-INVENTORY.json` |
| `auto.ui/playwright/pages/fragments/veiculoSection.ts` | Linha expansível de veículo (sem Salvar) |
| `auto.ui/playwright/support/page02Structural.ts` | Asserts estruturais com procedência explícita |
| `auto.ui/playwright/e2e/contratos/page02/ba-estrutural.spec.ts` | Spec BA `@mocked` + `@live-readonly` (gated) |
| `auto.ui/playwright/tests/ufUiProfile.test.ts` | Unitário do perfil live vs matriz Java |

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `auto.ui/playwright/pages/contratoPage.ts` | Compõe `veiculos`; `marcaObrigatorio` público. `preencherVeiculo` **não** deixa de salvar (suíte de registro intacta) |
| `auto.ui/playwright/support/persistGuard.ts` | `installPersistAttemptLog` + `isMutatingMethod` |
| `auto.ui/playwright/tests/persistGuard.test.ts` | Cobertura do método mutável |
| `auto.ui/playwright/package.json` | Script `test:page02:ba` (só `@mocked`) |
| `auto.ui/playwright/.env.example` | `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=0` |

Não alterados: fixtures Java `fixtures/matriz/*`, `DetranUf`, suíte de registro, matriz Java.

## Arquitetura

Um `ContratoPage` compartilhado + perfil de UF + fragmento de veículo.

```
LIVE-FIELD-INVENTORY.json     evidência visual (presença / *)
fixtures/matriz/{UF}.json     regras Java (backend, testes mockados)

pages/contratoPage.ts         destino, agente, submit, registro mockado
pages/fragments/veiculoSection.ts
support/ufUiProfile.ts        só live
support/matrizLoader.ts       só Java
support/persistGuard.ts       mocked | live-readonly
```

Não há 22 Page Objects. MA/SE/CE/RO **não** entram na suíte de registro.

## Origem das regras

| Regra | Fonte | Confiança | Onde entra |
|---|---|---|---|
| Seções e `*` da casca BA | `LIVE_FIELD_INVENTORY` | CONFIRMADA_LIVE | spec `@live-readonly` |
| Zero km, UF/Placa/RENAVAM | live DOM (Gates 1–3) | CONFIRMADA_LIVE | fragmento + ambas as specs (SPA Nova UX) |
| Novo/usado só BA | live + Java `INDICA_NOVO_USADO` | as duas, **separadas** | live usa inventário; mocked também checa Java |
| `*` Agente / Nº contrato / CPF / Nome | matriz Java | CONFIRMADA_JAVA | spec `@mocked` |
| Registrar / upload | persistGuard | — | live aborta; mocked não clica Registrar nesta spec |
| SE sem form, MA sem Java | inventário live | CONFIRMADA_LIVE | unitário; **não** há spec de registro |

As fontes **não** são mescladas em um único objeto de regras.

## Locators reutilizados (Gate 1 / catálogo)

Âncora: `article` com heading `Veículos`. Sem IDs `*-veic-{timestamp}-n`.

| Alvo | Locator |
|---|---|
| Página | `heading` Registrar contrato |
| Destino | `combobox` Destino |
| Adicionar | `button` /Adicionar veículo/i |
| Chassi | `textbox` /^Chassi/i |
| Gravame | `textbox` /gravame\|restrição/i |
| Zero km | `combobox` /Veículo zero km/i |
| Novo/usado | `combobox` /Novo\s*\/\s*usado/i (BA) |
| Motor | `textbox` /Número motor/i (BA) |
| UF da placa / Placa / RENAVAM | combobox + textboxes; só com zero km = Não |
| Excluir | `button` /Excluir veículo/i |
| Salvar | visível para assert; **nunca clicado** neste piloto |
| Registrar | visível; **nunca clicado** neste piloto |

## Resultado dos testes mockados

Executados em 2026-11-05, `vbconnection-newfront`, `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=0`.

| Suíte | Resultado |
|---|---|
| `npm run test:unit` | **57 passed** (inclui 5 novos de `ufUiProfile` e 1 de `persistGuard`) |
| Registro BA `@mocked` | **passed** (obrigatórios + registrar) — `preencherVeiculo`/`Salvar` intactos |
| PAGE-02 BA estrutural `@mocked` | **passed** após correção `heading` `Contrato` com `exact: true` (o h1 “Registrar contrato” colidia em strict mode) |
| Demais UFs da suíte de registro `@mocked` | **passed** (SE skip). Falhas iniciais em PE/PR/RJ/RN/RR foram `ENOSPC` no fechamento do browser (disco ~0,5 GB livre + 6 workers com vídeo); rerun `--workers=1 --trace off` **10 passed** |
| `@live-readonly` BA | **passed** (11,7s) após autorização; Master + persistGuard; sem Registrar/upload |

Primeira execução live falhou em strict mode: `hasText: 'CNPJ'` + fallback de página casava Agente e Devedor. Correção: `marcaObrigatorioCampo` usa `#id-label` estável do inventário (`cnpjAgenteFinanceiro-label`), sem IDs `*-veic-{timestamp}-*`.

O gate `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1` permanece; a suíte CI default não sobe o live.

## Limitações do piloto

- Só PAGE-02 / só BA.
- Não valida submit, blur de “Campo obrigatório” funcional, upload nem WebPKI.
- `*` live (23 campos) não é aplicado no `@mocked` — o GET form mockado segue a matriz Java.
- Zero km não existe na matriz Java; a spec mockada cobre o campo da Nova UX, com procedência live anotada.
- `selecionarDetran` ainda consulta a matriz Java (BA possui coluna). Não serve para MA.
- POST incidentais (`servicos-cliente` etc.) podem aparecer no log live e ser abortados; o assert recusa só mutação definitiva (registrar/upload/salvar).

## Pré-requisitos para execução live

1. Autorização explícita desta conversa.
2. `PLAYWRIGHT_MASTER_USER` / `PLAYWRIGHT_MASTER_PASSWORD` no `.env` (perfil Master).
3. `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1`.
4. `persistGuard` live-readonly (já no `beforeEach` da spec).
5. Newfront alcançável; **não** usar `mockLoginApis` / `seedAuthenticatedSession`.
6. Comando (não executar agora):

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "$env:USERPROFILE\AppData\Local\ms-playwright"
$env:PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE = "1"
npx playwright test --project=vbconnection-newfront e2e/contratos/page02/ba-estrutural.spec.ts --grep "@live-readonly"
```
