# Inventário de páginas

Rotas pedidas versus o que o Apache do newfront e o Angular realmente fazem.

O newfront **não faz fallback SPA**: `GET /vbconnection/*` no servidor devolve 404. Os testes existentes carregam `/` e navegam com `history.pushState` (`gotoApp` em `auto.ui/playwright/support/navigation.ts`). **CONFIRMADO_TESTE** e documentado no próprio helper.

| ID | Funcionalidade | URL pedida | Permissão (legado v2) | Status auditoria |
|---|---|---|---|---|
| PAGE-01 | Login / home | `/` | pública / autenticada | Login **CONFIRMADO_DOM**. Home autenticada **BLOQUEADO** (senha expirada). Home mockada **CONFIRMADO_TESTE**. |
| PAGE-02 | Registro de contrato | `/vbconnection/contrato/inserir` | `CONTRATO_EDITAR` | POM + 19 wrappers UF **CONFIRMADO_TESTE** (API mockada). Live **BLOQUEADO**. Matriz **CONFIRMADO_CODIGO**. |
| PAGE-03 | Registro de aditivo | `/vbconnection/contrato/aditivo/inserir` | `CONTRATO_EDITAR` | Sem POM Nova UX. Mapeado no routing e HTML v2 + matriz aditivo. Live **BLOQUEADO**. |
| PAGE-04 | Aditivo RS | `/vbconnection/contrato/aditivo-rs/inserir` | `CONTRATO_EDITAR` | `AditivoFormRsComponent`; destino desabilitado. Live **BLOQUEADO**. |
| PAGE-05 | Contratos em lote | `/vbconnection/contrato/lote` | `CONTRATO_EDITAR` | v2 rota equivalente `arquivo/upload`. Live **BLOQUEADO**. |
| PAGE-06 | Aditivos em lote | `/vbconnection/contrato/aditivo/lote` | `CONTRATO_EDITAR`, `ARQUIVOS_ENVIO`, contigência B3 | v2 `AditivoLoteFormComponent`. Live **BLOQUEADO**. |
| PAGE-07 | Imagens em lote | `/vbconnection/registrar/imagem/lote` | `IMAGEM_UPLOAD` | v2 path `imagem/lote`. Live **BLOQUEADO**. |
| PAGE-08 | Imagens por tela | `/vbconnection/registrar/imagem/tela` | `IMAGEM_UPLOAD` | v2 path `imagem/criar`. Live **BLOQUEADO**. |

## Menus (Nova UX, sessão mockada)

Ordem do topo confirmada em teste: Início, Faturamento, Gerenciar Usuários, Legislação, vbPlay, vbChat; item vbAuto visível. Atalho da home **Registro de Contrato** abre PAGE-02. **CONFIRMADO_TESTE**. Menu Master real **NÃO_ANALISADO**.

## Deep links

| Ação | Resultado esperado | Evidência |
|---|---|---|
| Abrir `/` | shell de login | CONFIRMADO_DOM 2026-11-05 |
| Abrir `/vbconnection/home` sem sessão via `gotoApp` | permanece no login | CONFIRMADO_TESTE (`login.spec.ts`) |
| `GET` HTTP direto `/vbconnection/contrato/inserir` | 404 Apache | CONFIRMADO_TESTE (comentário `navigation.ts`) |
