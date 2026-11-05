# Gate 3 — Resultado do mapeamento PAGE-02 (22 UFs)

**Status:** CONCLUÍDO (somente leitura)  
**Data:** 2026-11-05  
**Alvo:** `https://newfront.vbconnection.info/vbconnection/contrato/inserir`  
**Perfil:** MASTER · persistGuard · `abortados: []`  
**Referências:** BA Gate 1 · CE/RO Gate 2 · demais Gate 3 (19 UFs, uma sessão, PAGE-02 reiniciada a cada destino)

## Diagnóstico em uma frase

**21 UFs carregam formulário real**; **SE não carrega**; **MA clona CE no DOM sem matriz Java**; veículo é sempre linha + `veiculoZeroKm` (default Sim) nas 21; **Novo/usado só na BA**; TG live em CE, ES, MA, PR, RJ.

## Cobertura

| Conjunto | UFs | Form PAGE-02 |
|---|---|---|
| Combo live | 22 | — |
| Form disponível | 21 | LIVE_UI |
| Sem form | **SE** (id 229) | LIVE_UI — headings só Destino + Documentos |
| Inspecionadas neste gate | 19 | 18 OK + SE SEM_FORMULARIO |
| Preservadas Gate 1/2 | BA, CE, RO | OK |

Nenhuma UF do combo ficou sem classificação. Combo ≠ form: só SE quebra essa equivalência.

## Achados que mudam a automação

1. **SE** no combo ATIVO **não** materializa Agente/Veículos/Contrato — confirma `formularioIndisponivel` no live, não só no mock.
2. **MA** (id 238) **tem** form completo, **idêntico em labels à CE** (68 campos, 25 `*`, TG). Sem coluna Java. Não automatizar como clone silencioso.
3. **Zero km → placa/UF/RENAVAM** nas **21** UFs com form. Matriz Java e POM não modelam isso.
4. **Novo/usado obrigatório só BA** — as outras 20 com form **não** exibem o combobox (LIVE_DOM).
5. **TG live:** CE, ES, MA, PR, RJ. Java previa CE, ES, PR, RJ. **MA é extra live.**
6. **Credor e Documentos** presentes em todas as 21 com form. SE mostra heading Documentos sem o restante do cadastro.
7. Números de `*` **não** são homogêneos (RO 11 … RN 30). Massa única é falsa.

## Persistência

Nenhum Salvar, Registrar, upload, DETRAN ou B3. Linhas de veículo descartadas. POM, fixtures, mocks e suíte **não** alterados.

## Entregáveis

| Arquivo | Papel |
|---|---|
| [LIVE-UF-MATRIX.md](./LIVE-UF-MATRIX.md) | 22 UFs |
| [LIVE-FIELD-INVENTORY.json](./LIVE-FIELD-INVENTORY.json) | inventário máquina |
| [LIVE-REQUIRED-FIELDS.md](./LIVE-REQUIRED-FIELDS.md) | `*` visuais |
| [LIVE-CONDITIONAL-FIELDS.md](./LIVE-CONDITIONAL-FIELDS.md) | zero km, TG, UF/cidade |
| [LIVE-VS-JAVA-VS-MOCK.md](./LIVE-VS-JAVA-VS-MOCK.md) | três SoTs |
| [UF-GROUPING.md](./UF-GROUPING.md) | clusters (sem colapsar regras) |
| [LOCATOR-CATALOG.md](./LOCATOR-CATALOG.md) | locators reutilizáveis |
| [RISKS-AND-BLOCKERS.md](./RISKS-AND-BLOCKERS.md) | riscos |
| [AUTOMATION-ARCHITECTURE-PROPOSAL.md](./AUTOMATION-ARCHITECTURE-PROPOSAL.md) | arquitetura Playwright |
| [ufs/](./ufs/) | relatório por UF |
