# Gate 1 — Resultado da inspeção PAGE-02 Bahia

**Status:** CONCLUÍDO (somente leitura)  
**Data:** 2026-11-05  
**Alvo:** `https://newfront.vbconnection.info/vbconnection/contrato/inserir`  
**Modo:** live-readonly · persistGuard ativo desde o contexto · perfil MASTER  
**Spec:** `auto.ui/playwright/e2e/gate1/inspect-page02-ba-veiculo.spec.ts` (`PLAYWRIGHT_GATE1_LIVE=1`)  
**Persistência:** nenhum Salvar, Registrar, upload, POST/PUT/PATCH/DELETE de negócio

## Achados centrais

| # | Achado | Fonte | Confiança |
|---|---|---|---|
| 1 | Autenticação MASTER reconfirmada; PAGE-02 acessível | `gate1-status.json` | CONFIRMADA_LIVE |
| 2 | Combo live: **22 UFs** (`codigoUf`) | `gate1-ufs.json` + destinos-combo | CONFIRMADA_LIVE |
| 3 | Inclusão de veículo **não é modal** (`role=dialog` ausente): linha expansível na tabela | DOM + screenshot | CONFIRMADA_LIVE |
| 4 | `INDICA_NOVO_USADO` existe, visível e obrigatório (`formcontrolname=indicaNovoUsado`, opções Novo / Usado) | `gate1-indica-novo-usado.json` | CONFIRMADA_LIVE |
| 5 | Campo extra da Nova UX: **Veículo zero km?** (`veiculoZeroKm`), default **Sim**, opções Sim / Não | idem | CONFIRMADA_LIVE |
| 6 | Com zero km = Sim: 5 campos na linha (Chassi*, Gravame*, Zero km, Novo/usado*, Motor) | `gate1-veiculo-novo.json` / `usado.json` | CONFIRMADA_LIVE |
| 7 | Com zero km = Não: aparecem UF da placa, Placa e RENAVAM (sem `*` visual) | `gate1-veiculo-nao-zerokm.json` | CONFIRMADA_LIVE |
| 8 | Alternar Novo ↔ Usado **não** altera o conjunto de campos | novo.json ≡ usado.json | CONFIRMADA_LIVE |
| 9 | Não há botão **Cancelar**. Descarte da linha não persistida: **Excluir veículo** | `gate1-veiculo-actions.json` | CONFIRMADA_LIVE |
| 10 | Casca PAGE-02: **47** campos; **23** com `*` visual — iguais ao Gate 0 | `gate1-page02-inventory.json` | CONFIRMADA_LIVE |
| 11 | `abortados: []`; Salvar/Registrar **não** clicados | `gate1-status.json` | CONFIRMADA_LIVE |
| 12 | Matriz Java e mocks **não** foram alterados | decisão de escopo | — |

## Números

| Métrica | Valor |
|---|---|
| Perfil | MASTER |
| UFs no destinos-combo | 22 |
| Campos da casca PAGE-02 | 47 |
| Obrigatórios visuais (casca) | 23 |
| Campos da linha de veículo (zero km Sim) | 5 |
| Campos da linha de veículo (zero km Não) | 8 |
| Tipo de restrição (opções) | 4 |
| Agentes financeiros visíveis no combo | 11 (CNPJ redigido) |
| Operações persistentes | 0 |

## Entregáveis

| Arquivo | Conteúdo |
|---|---|
| [BA-VEICULO-MODAL.md](./BA-VEICULO-MODAL.md) | Formulário inline de veículo |
| [BA-FIELD-INVENTORY.md](./BA-FIELD-INVENTORY.md) | Inventário dos 47 + veículo |
| [BA-LOCATORS.md](./BA-LOCATORS.md) | Locators por estabilidade |
| [BA-SCENARIOS.md](./BA-SCENARIOS.md) | Matriz de cenários (não executados) |
| [BA-LIVE-VS-JAVA-VS-MOCK.md](./BA-LIVE-VS-JAVA-VS-MOCK.md) | Comparação campo a campo |
| [LIVE-UF-STATUS.md](./LIVE-UF-STATUS.md) | 22 UFs classificadas |
| [RISKS-AND-BLOCKERS.md](./RISKS-AND-BLOCKERS.md) | Riscos e decisões |

Dumps sanitizados (gitignored): `docs/qa-mapping/evidence/live/gate1-*.json`.

## O que não foi feito (restrito)

- Page Objects, fixtures, mocks e testes de regressão novos (além do spec de inspeção).
- PAGE-03..08.
- Registro de contrato, inclusão persistida de veículo, upload, DETRAN, B3.
- Commit / push.
- Inspeção do formulário completo de MA, SE, CE e RO (somente presença no combo).
