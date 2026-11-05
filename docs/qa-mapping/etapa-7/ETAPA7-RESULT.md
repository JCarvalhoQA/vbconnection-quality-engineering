# Etapa 7 — Resultado

Evolução da automação Playwright: flaky VA-1774, cobertura estrutural CE/RO, relatórios CI. **Sem** registro persistente. **Sem** disparo live na CI nesta etapa.

## Entregas

1. Causa-raiz do flaky: `click({ force: true })` no atalho da home antes do router Angular assentar.
2. Correção: `HomePage.abrirAtalho` + shell idle; 10/10 repeats; regressão local 0 flaky.
3. Environment `live-readonly`: secrets ok, **sem** reviewers/branch policy — proposta documentada, não aplicada.
4. CE e RO estruturais independentes (mocked + live gated). BA permanece.
5. 6 testes estruturais (3+3). Live CI pendente de aprovação de segurança.
6. Regressão mockada local: 82 passed, 3 skipped, 0 failed.
7. `typecheck` ok · unitários 59 passed.
8. Relatórios com classificação de sintoma e sanitização.

## Pendências de produto

- Homologação **funcional** CE/RO (submit, obrigatoriedade efetiva, DETRAN): **não** feita.
- Environment sem required reviewers: risco de disparo live por quem tem `workflow_dispatch`.
- `main` sem branch protection.

## Riscos restantes

- Limites do persistGuard (WebSocket, outro context, form nativo).
- Mocked CE/RO não reproduzem 100% dos `*` live (form mockado usa matriz Java).
- Flake SPA pode voltar se alguém reintroduzir `force: true` em atalhos.
