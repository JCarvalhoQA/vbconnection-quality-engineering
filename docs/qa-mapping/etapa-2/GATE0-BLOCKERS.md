# Gate 0 — Bloqueios

**Data:** 2026-11-05  
**Auth Master:** desbloqueado  
**PAGE-02 BA casca:** observada  
**Modal veículo / PAGE-03..08:** não executados (fora do escopo autorizado)

## Encerrados nesta execução

| ID | Item | Estado |
|---|---|---|
| GATE0-BLK-01 | Credencial Master ausente | **resolvido** (env local; `.env` gitignored) |
| GATE0-BLK-02 | Senha expirada / 2FA | **não ocorreu** (`passwordExpirado: false`, `autenticaEmDuasEtapas: false`) |
| GATE0-BLK-03 | prefs2 ≠ MASTER | **resolvido** (`perfil: MASTER` + rótulo Master no header) |
| GATE0-BLK-05 | PAGE-02 inacessível | **resolvido** |
| GATE0-BLK-06 | BA ausente no combo | **falso positivo de parser**; BA id 14 presente |

## Abertos / parciais

| ID | Item | Estado | Confiança |
|---|---|---|---|
| GATE0-BLK-08 | Modal veículo BA (Novo/Usado, chassi) não inspecionado | pendente de autorização para clicar Adicionar veículo **sem salvar** | NÃO OBSERVADO |
| GATE0-BLK-09 | SE no destinos-combo live sem coluna Java | produto/automação precisam decidir skip vs evidência UX | CONFIRMADO |
| GATE0-BLK-10 | MA no combo live, ausente na matriz Java e na suíte | idem | CONFIRMADO |
| GATE0-BLK-11 | Header POM `/administrador/i` ≠ Master live | risco para logout/menu, não para Gate 0 | CONFIRMADO_CODIGO vs CONFIRMADO_TESTE |
| GATE0-BLK-04 | Role `CONTRATO_EDITAR` listada no prefs2 | não dumpamos a lista de roles (PII/minimização); PAGE-02 abriu, então a permissão efetiva existe | HIPÓTESE forte |

## Recusados de propósito

- Submit de contrato, aditivo, lote, imagem, DETRAN, B3
- Mock de autenticação
- Gravação de token/`storageState`
- PAGE-03..08
- Alterar Page Objects
- Novos testes de regressão além do spec de inspeção

## Segurança operacional

- persistGuard live-readonly instalado antes da navegação
- Auth **não** interceptada para abortar (passthrough); mutações `/api/` continuam abortáveis
- `abortados: []` — nenhuma mutação de negócio foi disparada
- Credencial estava comentada em `.env.example` (arquivo versionado); movida para `.env` e o exemplo foi limpo. **Não commitar `.env` nem senha no example.**
