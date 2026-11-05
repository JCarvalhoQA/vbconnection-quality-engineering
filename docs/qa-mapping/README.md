# Mapeamento QA — VBConnection (Nova UX)

Auditoria de locators, regras por UF e cenários de teste das páginas de registro do **VBConnection** em `https://newfront.vbconnection.info/`.

**Escopo desta entrega:** investigação, documentação, rastreabilidade e planejamento. Nenhuma suíte de regressão nova foi implementada e nenhuma operação persistente (contrato, aditivo, lote, DETRAN/B3) foi executada.

## Como navegar

| Documento | Conteúdo |
|---|---|
| [EXECUTIVE-SUMMARY.md](./EXECUTIVE-SUMMARY.md) | Totais, cobertura, ordem de implementação |
| [PAGE-INVENTORY.md](./PAGE-INVENTORY.md) | PAGE-01 a PAGE-08 |
| [LOCATOR-STANDARDS.md](./LOCATOR-STANDARDS.md) | Padrão de seletores Playwright |
| [AUTOMATION-STRATEGY.md](./AUTOMATION-STRATEGY.md) | Arquitetura em cima do Playwright existente |
| [RISKS-AND-BLOCKERS.md](./RISKS-AND-BLOCKERS.md) | Impedimentos e riscos |
| [pages/](./pages/) | Inventário por funcionalidade |
| [locators/](./locators/) | Catálogo de seletores |
| [states/](./states/) | Matriz e um arquivo por UF |
| [scenarios/](./scenarios/) | Matriz BDD e Gherkin |
| [evidence/](./evidence/) | Matriz Java extraída e inspeção live |
| [etapa-2/](./etapa-2/) | **Etapa 2:** conciliação UF, divergências mock×Java, plano POM/fixtures, critérios de entrada |

## Fontes de verdade

1. **CONFIRMADO_CODIGO** — `auto.core/.../formulario/matriz/MatrizDados*.java` e `FormRestController`.
2. **CONFIRMADO_TESTE** — POM e specs em `auto.ui/playwright` (sessão mockada, sem persistir no HMG).
3. **CONFIRMADO_DOM / CONFIRMADO_UI** — inspeção de `newfront` em 2026-11-05 (login e senha expirada).
4. **INFERIDO** — Angular legado `auto.ui/vb-auto-v2` para aditivo/lote/imagens, enquanto o fonte da Nova UX (`auto.ui/migracao/vbconnection`) não está versionado neste checkout.
5. **BLOQUEADO** — páginas autenticadas PAGE-02 a PAGE-08 no newfront real (senha da massa e2e expirada; perfil Master ausente).

## Classificação de confiança

`CONFIRMADO_DOM` · `CONFIRMADO_UI` · `CONFIRMADO_CODIGO` · `CONFIRMADO_TESTE` · `INFERIDO` · `BLOQUEADO` · `NÃO_ANALISADO`

Hipótese nunca é apresentada como regra comprovada.
