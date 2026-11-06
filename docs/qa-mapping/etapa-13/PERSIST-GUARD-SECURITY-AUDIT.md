# Auditoria persistGuard e live-readonly — Etapa 13

**Evidência:** `support/persistGuard.ts`, `tests/persistGuard.test.ts`, `playwright.config.ts` (`serviceWorkers: 'block'`), workflow `live-readonly`.

## Controles

| Canal | Cobertura | Classificação |
|---|---|---|
| fetch/XHR mutável `/api/` live | Abort `POST/PUT/PATCH/DELETE` | Forte |
| `contratos/registrar` live | Abort | Forte |
| Auth `/auth/tokens|refresh` | Allowlist | Forte |
| GET consultas (destinos, form) | Permitido | Correto |
| GET em URL de persistência | **Não aborta** | Limitação |
| WebSocket | Não interceptado | Limitação |
| Service Worker | `serviceWorkers: 'block'` | Forte (config) |
| Outro BrowserContext | Fora do page.route | Limitação |
| Form nativo cross-origin | Fora do guard | Limitação |
| Rotas instaladas depois do guard | LIFO | Limitação documentada |
| Credencial em artifact | live: trace/video off; sanitize | Forte |
| Secrets no relatório | Não impressos | Forte |

## Credencial Master

Classificação: **`BLOCKED_SECURITY_CREDENTIAL_ROTATION`**.

Incidente: artifact `42220549160` (excluído). Timestamps conhecidos do secret **anteriores** ao leak. Sucesso live `42281730173` **não** prova rotação. Expiração periódica **não** é rotação antecipada.

`AUTH_PASSWORD_EXPIRED` permanece: interrompe, não altera senha, não loga credencial, pede atualização do secret após troca autorizada.

## Testes unitários

Tabela permitidos vs proibidos em `tests/persistGuard.test.ts` (GET destinos/form, POST auth vs POST registrar/upload/gravame/B3/DELETE).

## YAML desta etapa

Job live exige `github.ref == 'refs/heads/main'`. `ci-select` recusa live-readonly se `GITHUB_REF` existir e não for `main`.

## Impacto / recomendação / status / limitação

Impacto: dispatch live em feature branch não sobe o job nem passa no select.  
Recomendação: responsável autorizado registrar a decisão de rotação; até lá live MA/TO permanece bloqueado por política, além da pendência de execução.  
Status: guard preservado e testado.  
Limitação: GET com side-effect e WebSocket não cobertos de propósito (evitar política simplista).
