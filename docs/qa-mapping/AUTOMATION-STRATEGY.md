# Estratégia de automação

## O que já existe (reutilizar)

| Item | Valor |
|---|---|
| Pacote | `auto.ui/playwright` (`vbconnection-playwright`) |
| Playwright | `^1.55.0` declarado; lock **1.63.0** |
| Linguagem | TypeScript, Node ≥ 20 |
| Projetos | `vbconnection-docker` (`http://localhost:8080`) e `vbconnection-newfront` |
| `npm test` | newfront |
| POM | `pages/loginPage.ts`, `contratoPage.ts`, `homePage.ts`, `formPage.ts` |
| Actions | `actions/contratoActions.ts` |
| Auth | `seedAuthenticatedSession` + `mockLoginApis` (não usa `storageState` ainda) |
| Massa | `fixtures/login.mass.json` + `ContratoFactory` |
| Relatórios | list, HTML `playwright-report`, JSON, JUnit |
| Artefatos de falha | trace, screenshot, video `retain-on-failure` |
| CI | `.github/workflows/qa-automation-hmg.yml` (não bloqueante; YAML precisa estar em `main`) |
| Testes de contrato | 19 wrappers UF + a11y VA-1773 + atalho VA-1774 |

**Não sobrescrever** `gotoApp`, o tratamento de Blip, os IDs `#devedor*`, nem o `test.fixme` de recuperação de senha.

## Lacunas

- Sem Page Object de aditivo, aditivo RS, lotes e imagens.
- Mock de cadastro **homogêneo** (`contratoCadastroMocks.ts`) não reflete `MatrizDados*`.
- `SE` usa ID sintético 27; `CE`/`RO` ausentes na suíte.
- Auth real no newfront bloqueada (senha expirada / Master ausente).
- Fonte Nova UX ausente no git.

## Arquitetura proposta (incremental)

```
auto.ui/playwright/
  pages/          # 1 POM por página; seções extraídas (devedor, veiculoModal)
  actions/        # orquestra fluxos; asserts de negócio
  config/detransIds.ts + fixtures/matriz/{UF}.json  # gerados da matriz Java
  support/auth.ts # storageState opcional por ambiente, mocks no padrão atual
  e2e/contratos/registro/{uf}.spec.ts  # já existe; parametrizar massa
  e2e/aditivos/
  e2e/lotes/
  e2e/imagens/
```

Filtros já possíveis: `--grep @sp`, `@contrato`, `@smoke`, `--project=vbconnection-newfront`.

Paralelo: seguro **somente** com mocks (como hoje, `fullyParallel: true`). Qualquer hit em API real: `workers: 1` e never `POST contratos/registrar` sem mock.

Dados: gerar `matriz/{UF}.json` a partir de `docs/qa-mapping/evidence/matriz-form.json` para o teste comparar GET real (homologação dedicada) ou para o mock deixar de ser único.

## Etapas de implementação (aprovação necessária para código)

1. Auth `storageState` + credencial Master em `.env` (não commitada).
2. Fixture de matriz por UF e ajuste fino dos mocks.
3. POM aditivo / RS.
4. POM lote/imagem com arquivos sintéticos; abort de POST.
5. Tags `@p0` no smoke GHA já existente.
