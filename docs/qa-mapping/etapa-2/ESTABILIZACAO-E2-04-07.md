# Estabilização E2-04..07 e preparação Gate 0

Data: 2026-11-05. Sem commit. Gate 0 **não executado**.

## 1. Revisão do diff

- Gerador não era determinístico (`geradoEm: new Date().toISOString()`). Corrigido: `fonteHash` SHA-256 do JSON-fonte, UFs/campos ordenados.
- Regenerar duas vezes: hashes idênticos (`todas.json` e `DF.json`).
- 20 fixtures Java (CE/RO fora da suíte; SE sem arquivo). `matriz:compare` → overlap=20 mismatch=0 missing=0 extra=0.
- Fixtures: só booleanos e nomes de campo; sem PII/segredos.
- `@mocked` permanece nos fluxos de registro; Gate 0 é `@live-readonly` e skip sem `PLAYWRIGHT_GATE0_LIVE=1`.

## 2. DF happy path

Causa: `nz-date-picker#dataPagamento` (id duplicado no host e no input). `fill()` + Tab fechava o overlay sem commitar o FormControl.

Correção: `fillNzDatePicker` — clique, `pressSequentially` dd/MM/yyyy, Enter, fallback na célula `ant-picker-cell-in-view`. `test.skip` removido depois de 3/3 passes.

## 3. Flake `gotoApp`

Causa: `pushState` antes do router Angular terminar a navegação inicial para `/vbconnection/home`, que sobrescrevia o destino.

Correção: esperar shell autenticado + path estável (250 ms sem mudança de pathname), então um `pushState`; uma única retentativa se o bootstrap vencer a corrida. Sem `networkidle`, sem retries de spec.

## 4. Testes

| Bateria | Qtd | Resultado | Duração |
|---|---|---|---|
| Unit | 51 | 51 passed | 1.4 s |
| `matriz:generate` ×2 | 2 | hashes iguais | <10 s |
| `matriz:compare` | 1 | 0/0/0 | <1 s |
| DF validar ×3 | 3 | 3 passed | 7–11 s |
| DF registrar ×3 | 3 | 3 passed | 17–23 s |
| gotoApp ×15 (5 casos ×3) | 15 | 15 passed | 5–10 s |
| E2E mocked contratos+a11y+atalho | 46 | **44 passed, 2 skipped (SE)** | 2.2 min |
| Gate 0 live | 0 | **não executado** | — |

Nenhuma falha na bateria mocked. Nenhum POST real de negócio.

## 5. Divergências remanescentes

- Sem evidência live Master/PAGE-02 (Gate 0 não rodou).
- CE/RO fora da suíte até destinos-combo live.
- SE skip (`formularioIndisponivel`).
- POM ainda é PAGE-02; PAGE-03..08 não implementados.
- Credor/TG profundos (E2-20) só o necessário ao submit mockado.
- Nova UX vs Java: CONFIRMADO_CODIGO no mock; paridade live pendente.

## 6. Limites do persistGuard

**mocked:** aborta mutações em padrão de persistência (contrato(s), aditivo, lote, imagem, gravame, B3, upload, salvar/gravar/incluir); `POST contratos/registrar` faz fallback para o mock.

**live-readonly:** aborta qualquer POST/PUT/PATCH/DELETE em `/api/` ou `vbauto.api`, **incluindo registrar**. Allowlist: `/auth/tokens|refresh|otp|2fa`. GET (destinos-combo, prefs2, form) passa.

Não cobre: WebSocket, outro `BrowserContext`, rotas registradas depois do guard, form nativo para origem fora do padrão, service worker (já bloqueado no config).

## 7. Gate 0 — pronto, não autorizado

Ver `GATE0-CHECKLIST.md`. Spec skip sem env. Sem mock de auth. Sem submit. Evidências gitignored + sanitizer.

## 8. Não avançar

Não implementar PAGE-03..08, não commitar, não executar live.
