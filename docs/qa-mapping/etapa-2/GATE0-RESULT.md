# Gate 0 — Resultado da inspeção live

**Status:** PARCIALMENTE CONCLUÍDO  
**Data:** 2026-11-05  
**Alvo:** `https://newfront.vbconnection.info`  
**Modo:** live-readonly · persistGuard ativo · sem mock de autenticação · sem submit

## Achados

| # | Achado | Fonte | Confiança |
|---|---|---|---|
| 1 | `POST /vbauto.api/auth/tokens` HTTP 200, sessão com token, sem 2FA, senha não expirada | `gate0-tokens-status.json` (corpo do token não gravado) | CONFIRMADO |
| 2 | `GET /vbauto.api/auth/prefs2` HTTP 200, `perfil.perfil = MASTER` | `gate0-prefs-meta.json` | CONFIRMADO |
| 3 | Header da Nova UX exibe rótulo **Master** | screenshot PAGE-02 + a11y snapshot | CONFIRMADO |
| 4 | PAGE-02 `/vbconnection/contrato/inserir` acessível ao Master | URL + heading Registrar contrato | CONFIRMADO |
| 5 | Destino **DETRAN-BA** selecionável | combo + `codigoUf: BA` no destinos-combo | CONFIRMADO |
| 6 | Nenhum POST de contrato/aditivo/lote/imagem/B3 | `abortados: []`; spec não clica em Registrar | CONFIRMADO |
| 7 | Inventário DOM após BA: **47** campos; **23** com `*` visual | `page02-ba-inventory.json` | CONFIRMADO_TESTE |
| 8 | Modal de veículo **não aberto** (sem Adicionar veículo) | decisão de escopo — sem persistência | CONFIRMADO |

## Números

| Métrica | Valor live |
|---|---|
| Autenticação | OK |
| Perfil | MASTER |
| UFs no destinos-combo | **22** |
| Campos identificados (DOM) | **47** |
| Locators de casca validados | **5** (heading, Destino, Agente, Veículos, submit habilitado após BA) |
| Obrigatórios visuais (`*`) | **23** |
| Submit do formulário | **não executado** |

Dumps sanitizados (gitignored): `docs/qa-mapping/evidence/live/`.

Page Objects de produção **não** foram alterados nesta execução.
