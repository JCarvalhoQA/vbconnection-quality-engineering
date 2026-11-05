# Resumo executivo — auditoria QA VBConnection

Data da auditoria: **2026-11-05**. Alvo: `https://newfront.vbconnection.info/`. Perfil solicitado: **Master**. Perfil disponível na massa segura do Playwright: **ADMINISTRADOR** (senha expirada no newfront; senha **não** foi alterada).

## Totais

| # | Indicador | Valor | Confiança |
|---|---|---|---|
| 1 | Páginas obrigatórias investigadas | 8/8 — PAGE-01 no DOM live; PAGE-02..08 bloqueadas no newfront e mapeadas por código/POM | misto |
| 2 | UFs na referência do pedido | 19 | — |
| 3 | UFs na matriz Java (`DETRAN` enum de formulário) | 20 (AC, AP, BA, CE, DF, ES, MG, MS, MT, PB, PE, PR, RJ, RN, RO, RR, RS, SC, SP, TO) | CONFIRMADO_CODIGO |
| 4 | UFs no Playwright atual | 19 (inclui SE sintético; não inclui CE/RO) | CONFIRMADO_TESTE |
| 5 | UFs com análise individual | 21 (20 Java + SE) | misto |
| 6 | Campos distintos na matriz de formulário | 124 | CONFIRMADO_CODIGO |
| 7 | Ocorrências visíveis (soma UF×campo) | 1319 | CONFIRMADO_CODIGO |
| 8 | Ocorrências obrigatórias confirmadas na matriz | 665 | CONFIRMADO_CODIGO |
| 9 | Locators validados (DOM live + POM/teste) | 33 login/contrato; demais são candidatos do legado v2 | misto |
| 10 | Cenários positivos | 49 (inclui hipóteses UF novo/usado) | ver matriz |
| 11 | Cenários negativos | 14 | ver matriz |
| 12 | Cenários específicos por UF | 43 (20 novo + 20 usado + PR/PB/SE) | particionamento |
| 13 | Candidatos à automação (`Sim`) | 75 | 17 já confirmados por teste/DOM |
| 14 | Funcionalidades bloqueadas no newfront real | PAGE-02 a PAGE-08 + menu Master | BLOQUEADO |
| 15 | Regras não confirmadas na UI live | asterisco por campo/UF; Envio B3; wizard vs. form único | NÃO_ANALISADO / INFERIDO |

## Achados críticos

1. **Não há credencial Master** em `.env` nem na massa Playwright. A persona `admin` é `ADMINISTRADOR`.
2. Essa persona **autentica no newfront** e cai em **Alterar senha** (`#expirada-password`). A auditoria **não** trocou a senha.
3. O fonte Angular da Nova UX (`auto.ui/migracao/vbconnection`) **não está versionado** neste checkout (pasta vazia, 0 arquivos no git).
4. O registro de contrato na Nova UX, pelos testes existentes, é um **formulário longo com seções**, não o wizard de 7 etapas do enunciado. **Envio B3 não existe** na matriz `DadosForm`.
5. A matriz Java **é por UF de verdade**. Os mocks Playwright devolvem **a mesma matriz para todas as UFs** — risco de falso positivo na regressão.
6. **SE** não existe em `serasa.data...DETRAN`. **CE** e **RO** existem na matriz e no `DetranNumeroEnum`, mas não na suíte Playwright de 19 UFs.

## Matriz de cobertura (síntese)

`Página → UF → Etapa → Campo → Regra → Cenário → Locator → Evidência`

A matriz completa por campo está em [states/UF-COMPARISON.md](./states/UF-COMPARISON.md). A rastreabilidade Página×Cenário×Locator está em [scenarios/SCENARIO-MATRIX.md](./scenarios/SCENARIO-MATRIX.md).

Recorte de maior risco:

| Página | UF | Etapa | Campo | Regra | Cenário | Locator | Evidência |
|---|---|---|---|---|---|---|---|
| PAGE-01 | — | Login | Usuário / Senha | obrigatórios | SCN-LGN-02 | `#login-username` / `#login-password` | CONFIRMADO_DOM |
| PAGE-01 | — | Login | Alterar senha | política 8/Aa/1/esp | SCN-LGN-09 | `#expirada-*` | CONFIRMADO_UI |
| PAGE-02 | todas Java | Destino | Destino | dispara GET `/api/form/*` | SCN-CTR-01 | combobox Destino | CONFIRMADO_TESTE |
| PAGE-02 | todas Java | Veículo | NUMERO_CHASSI | visível+obrigatório | SCN-CTR-UF-NOVO | placeholder Chassi | CONFIRMADO_CODIGO + TESTE |
| PAGE-02 | PR, PB | Devedor | END_UF | trava residência | SCN-CTR-UF-TRAVA | combobox UF | CONFIRMADO_TESTE |
| PAGE-02 | BA/TO/ES/RS/DF/MT | Veículo | ANO_FABRICACAO | opcional no config PW; conferir matriz | SCN-CTR-UF-ANOFAB | label Ano fabricação | misto |
| PAGE-02 | CE, ES, PR, RJ | Terceiro garantidor | seção | visível se algum campo visível | SCN-CTR-TG | *(sem POM)* | CONFIRMADO_CODIGO |
| PAGE-03 | RR, PR, SC, AC, AP, RS | Aditivo | TIPO_ADITIVO | visível | SCN-ADT-TIPO | INFERIDO v2 | CONFIRMADO_CODIGO |
| PAGE-04 | RS | Aditivo RS | destino travado | tela específica RS | SCN-ADTRS-01 | INFERIDO v2 | CONFIRMADO_CODIGO |
| PAGE-05/06 | — | Lote | .txt/.csv | nome só [A-Za-z0-9] | SCN-LOT-01 | nz-upload | CONFIRMADO_CODIGO v2 |
| PAGE-07 | — | Imagem lote | .zip | 1 arquivo | SCN-IMG-L01 | nz-upload | CONFIRMADO_CODIGO v2 |
| PAGE-08 | SC/MS/MT | Imagem tela | tamanho PDF | 5 / 5 / 3,5 MB | SCN-IMG-T05 | upload-limits.ts | CONFIRMADO_CODIGO |

## Ordem sugerida de implementação

1. Desbloquear auth: credencial **Master** (ou ADMINISTRADOR com senha válida) só em `.env` local; `storageState` por ambiente.
2. Fechar PAGE-01 (já parcialmente coberto) e smoke de home/menu com sessão real.
3. PAGE-02: substituir mock homogêneo por **fixtures por UF** alinhadas à matriz Java; manter intercept de `POST contratos/registrar`.
4. PAGE-03 e PAGE-04 (aditivo / aditivo RS) — maior gap de POM.
5. PAGE-08 imagens por tela (limites por UF) com fixtures locais, sem upload real.
6. PAGE-05/06/07 lotes — testes de validação de arquivo **antes** do POST; nunca processar lote no newfront sem autorização.
7. Paralelismo só entre UFs com mocks isolados; serializar qualquer teste que fale com API real.

## Recomendações de testabilidade

- Incluir `data-testid` no toggle de visibilidade da senha (botão sem nome acessível).
- Distinguir placeholders dos três campos de senha expirada (hoje os três dizem "Digite sua senha").
- Versionar o fonte da Nova UX ou publicar mapa de `formcontrolname`/IDs.
- Expor na UI o mesmo contrato da matriz (`visivel`, `obrigatorio`) para o teste assertar contra o GET `/api/form/...` real em homologação dedicada.
