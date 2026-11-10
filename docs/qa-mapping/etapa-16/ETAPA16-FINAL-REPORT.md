# Relatório final — Etapa 16

**Main:** `7edfed2ee2f3d297075e3c0a0fd2afad86f0ba79`
**Branch:** `feat/playwright-etapa-16-negative-contract-tests`

## 17 analisados

CT-050, CT-051, CT-052, CT-053, CT-054, CT-055, CT-060, CT-061, CT-064, CT-070, CT-072, CT-073, CT-075, CT-077, CT-080, CT-081, CT-082.

| Decisão | Qtd |
|---|---:|
| Elegíveis (`READY_FOR_AUTOMATION`) | 2 |
| Automatizados | 2 (CT-052, CT-053) |
| Permanecem mapeados | 15 |
| Bloqueados por ausência de regra (`RULE_NOT_CONFIRMED`) | 9 |
| Dependência NX (`DEPENDENCY_MISSING`) | 6 |

Não foi meta 17/17.

## UF

Novos testes: **BA**. Estrutural mocked das 21 UFs: regressão verde. Não generalizar regra de BA.

## Artefatos

- Specs: `e2e/contratos/negativos/contrato-negativos.spec.ts`, `api-negativos.spec.ts`
- Mock: `registrarStatus` em `support/contratoCadastroMocks.ts`
- Helper: `ContratoPage.esperarRegistroSemSucesso`

## Qualidade

Typecheck ok · unit 93 · mutation 1.00 · gates 1–6 PASS · mocked 102/3/0 · live 0.

## Inventário

83 IDs. Automatizado 42 · mapeado 30 · parcial 4 · bloqueado 4 · N/A 3.

## Riscos

Credencial Master sem rotação. Live 0 no SHA atual. 15 negativos ainda sem spec. CT-053 não é DETRAN.
