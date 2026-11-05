# Checklist de prontidão — Gate 0 (não executar)

Inspeção live PAGE-02 BA com perfil Master. Código preparado; **execução exige autorização explícita** e `PLAYWRIGHT_GATE0_LIVE=1`.

## Spec preparado

- `auto.ui/playwright/e2e/gate0/inspect-page02-ba.spec.ts` — skip por padrão
- `auto.ui/playwright/support/liveInspect.ts` — credencial env, assert MASTER, dump sanitizado
- `installPersistGuard(page, { mode: 'live-readonly' })` **antes** do login
- Sem `mockLoginApis` / `seedAuthenticatedSession`

## Pré-condições

| # | Item | Estado |
|---|---|---|
| 1 | `PLAYWRIGHT_MASTER_USER` / `PASSWORD` no `.env` local | **presente** 2026-11-05 (gitignore) |
| 2 | `PLAYWRIGHT_MASTER_PERFIL=MASTER` | comprovado via prefs2 |
| 3 | Autorização humana para live-readonly | **concedida e executada** 2026-11-05 |
| 4 | `PLAYWRIGHT_GATE0_LIVE=1` só no momento da execução | usado nesta inspeção |
| 5 | persistGuard live-readonly aborta POST/PUT/PATCH/DELETE `/api/` (inclui `contratos/registrar`) | código pronto |
| 6 | GET `destinos-combo` permitido | código pronto |
| 7 | POST `/auth/tokens` permitido (login real) | allowlist |
| 8 | Evidências em `docs/qa-mapping/evidence/live/` gitignored + sanitizer | pronto |
| 9 | Sem PAGE-03..08 | respeitado |
| 10 | Sem submit do formulário PAGE-02 | spec não clica em Registrar |

## Durante a execução (quando autorizada)

1. Login UI com Master (sem mock de auth).
2. Assert `prefs2.perfil.perfil === 'MASTER'`. Se a UI/API não comprovar → **BLOQUEADO**.
3. Home `Bem-vindo` (não Alterar senha / 2FA não documentado).
4. Capturar GET `fornecedores/destinos-combo` sanitizado.
5. Abrir PAGE-02, selecionar BA, validar locators (Destino, Agente, Veículos, submit visível).
6. Dump DOM sanitizado + screenshot. Não gravar `storageState` nesta spec.
7. Não enviar o formulário. Não registrar contrato/aditivo/lote/imagem.

## Critério de bloqueio

Classificar **BLOQUEADO** se qualquer um ocorrer:

- Credencial Master ausente
- Login cai em senha expirada / 2FA / certificado
- `prefs2` sem `perfil === 'MASTER'`
- Role necessária a PAGE-02 ausente (documentar, não burlar)
- persistGuard não instalado antes da navegação

## Fora de escopo

Nova UX PAGE-03 a PAGE-08, operações persistentes, commit/push, mock de autenticação.
