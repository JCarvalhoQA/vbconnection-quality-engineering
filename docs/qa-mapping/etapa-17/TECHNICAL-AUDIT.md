# Auditoria técnica — Etapa 17

**HEAD da `main`:** `4ff36988a42a30b06374a3acd66fefd44689ea00` (merge do [PR #17](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/pull/17)).
**Data:** 2026-11-10.
**Escopo:** discovery dos 15 negativos ainda mapeados. Sem live. Sem registro persistente. Sem promoção a Automatizado.

## Baseline (pós-Etapa 16)

| Status | Qtd |
|---|---:|
| Automatizado | 42 |
| Parcialmente | 4 |
| Apenas mapeado | 30 |
| Bloqueado | 4 |
| Não aplicável | 3 |
| **Total** | **83** |

Mocked: 102 passed / 3 skipped. Mutation 420/0/42 = 1.00. Live no SHA atual: 0. Credencial: `BLOCKED_SECURITY_CREDENTIAL_ROTATION`.

## Método

1. CSV canônico (`CT-050` … conjunto abaixo).
2. Specs, POM, factories, mocks, `persistGuard`, `PAGE-INVENTORY.md`, páginas v2, Gherkin, inspeção live BA já versionada (`etapa-3/BA-VEICULO-MODAL.md`).
3. Sem sessão live nova.
4. v2 **não** é SoT da Nova UX.

## 15 IDs

Grupo A `RULE_NOT_CONFIRMED`: CT-050, CT-051, CT-054, CT-055, CT-060, CT-061, CT-072, CT-073, CT-075.

Grupo B `DEPENDENCY_MISSING`: CT-064, CT-070, CT-077, CT-080, CT-081, CT-082.

## O que esta etapa **não** faz

- Não altera totais de automação do inventário.
- Não cria POM vazio de PAGE-03…08.
- Não afirma que maxlength 21 (BA live) = “chassi deve ter 17”.
- Não reutiliza `#protocoloAditivo` v2 como locator NX.
