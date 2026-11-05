# Bloqueios, dependências e critérios para iniciar a automação

## Bloqueios abertos

| ID | Bloqueio | Impede | Dono provável |
|---|---|---|---|
| BLK-01 | Sem credencial Master | live PAGE-02..08, menus Master | QA/gestor |
| BLK-02 | ADMINISTRADOR com senha expirada | storageState dessa persona | não usar; não rotacionar nesta etapa |
| BLK-03 | Fonte Nova UX ausente no git | mapa completo de `formcontrolname` | front |
| BLK-04 | Mock homogêneo | significado das 19 specs UF | **feito** E2-04..07 (fixtures por UF) |
| BLK-05 | SE sem enum / form indisponível | tratar SE como produto | produto; suíte deve skip |
| BLK-06 | POST real no HMG se o mock falhar | gravame indevido | persistGuard obrigatório em live |
| BLK-09 | Web PKI PR (e RJ/TO no POM) | certificado | skip `@webpki` |
| BLK-11 | `INDICA_NOVO_USADO` só BA na Java vs 40 cenários “usado” | inflação falsa | reescrever cenários |
| BLK-12 | Nova UX vs matriz (`TIPO_CONTRATO` SP) desconhecida | qual SoT o teste deve seguir | Gate 0b |

## Dependências

```
Master .env ──► Gate 0 GET destinos ──► dump PAGE-02 BA
                                         │
matriz-form.json ──► fixtures/{UF}.json ─┴──► mock por UF ──► specs reescritas
aprovação do plano ──────────────────────────────────────────► qualquer .ts
```

Não há dependência de Jenkins/GHA para a etapa 2. CI continua mockada.

## Critérios objetivos para **começar** automação nova

A implementação de POM/fixtures/testes **só começa** se **todos** os itens abaixo forem verdadeiros. Caso contrário, permanece-se em evidência documental / Gate 0.

### Gate de autorização

- [ ] Este plano (`docs/qa-mapping/etapa-2/`) revisado por um humano do time.
- [ ] Aprovação explícita para alterar arquivos em `auto.ui/playwright/**/*.ts`.
- [ ] Escopo do primeiro PR combinado (sugerido: E2-04..07 + E2-09 + E2-10, **sem** live).

### Gate de segurança operacional

- [ ] Nenhum teste novo chama `POST contratos/registrar` sem intercept.
- [ ] Nenhum upload de lote/imagem real.
- [ ] Senha Master (se existir) só em `.env` local; `.auth/` gitignored (já está).
- [ ] Relatórios/evidências sem token, cookie ou senha.

### Gate de verdade de UF

- [ ] SE não entra como UF suportada.
- [ ] CE/RO não ganham spec até destinos-combo live (ou decisão documentada de mock-only com fixture Java, **marcada** como não evidenciada na UX).
- [ ] Fixture de campo deriva de `matriz-form.json`, não de `CAMPOS_*` copiados.

### Gate Master (só para `@live-readonly`)

- [ ] `PLAYWRIGHT_MASTER_*` preenchido.
- [ ] Login → home, perfil `MASTER`.
- [ ] `CONTRATO_EDITAR` (ou bloqueio explícito se Master não tiver a role).
- [ ] persistGuard ativo.

### Gate de SoT UI vs Java (piloto BA)

Antes de massificar asserts de obrigatoriedade:

- [ ] Dump DOM PAGE-02 BA: lista de labels/`*` / campos visíveis.
- [ ] Comparar com `BA.json` da matriz.
- [ ] Registrar divergências front×back (ex.: tipo de contrato visível apesar de Java oculto) em `evidence/`, sem “corrigir” o Java pelo teste.

## O que **já** pode continuar hoje (sem código novo)

- Testes mockados existentes (CI).
- Leitura desta pasta.
- Provisionamento da conta Master **fora** do repositório.

## O que **não** está autorizado ainda

- Novos Page Objects, `matrizLoader.ts`, specs CE/RO, live inspect autenticado, alteração de `.env.example`, commits.
