# Gate 1 — riscos, bloqueios e decisões

**Data:** 2026-11-05  
**PersistGuard:** ativo · `abortados: []` · nenhum Salvar/Registrar/upload

## Encerrados nesta gate

| ID | Item | Estado |
|---|---|---|
| GATE0-BLK-08 | Modal/linha de veículo BA | **observado** (inline; `INDICA_NOVO_USADO`; zero km; Excluir) |
| GATE1-VEI-DIALOG | Expectativa de `role=dialog` | **corrigido no spec de inspeção** (não no POM de produção) |

## Bloqueios que permanecem para automação de regressão live

| ID | Item | Impacto | Classificação |
|---|---|---|---|
| G1-01 | POM ainda pode esperar dialog / Cancelar / Situação do chassi | specs de registro BA live quebram ou clicarão Salvar | INCOMPATÍVEL POM×LIVE |
| G1-02 | IDs de veículo dinâmicos | locators `#chassi` do template local falham | CONFIRMADA_LIVE |
| G1-03 | `formcontrolname` colidindo (`uf`, `cidade`, `numero`) | falso positivo em credor/devedor/placa | CONFIRMADA_LIVE |
| G1-04 | Registrar contrato habilitado após BA | risco de clique acidental em qualquer spec | CONFIRMADA_LIVE |
| G1-05 | PAGE-03..08 sem autorização | não há evidência de consulta/aditivo/lote/imagem | PENDENTE |
| G1-06 | Logout POM `/administrador/i` vs header Master | flaky de sessão | CONFIRMADA_LIVE vs CONFIRMADA_JAVA/POM |
| G1-07 | Knowledge MCP `NO_KEY` | RAG do cliente indisponível; mapeamento só com repo + live | PENDENTE infra |

## Riscos de produto (paridade BA)

| ID | Risco | Evidência | Precisa decisão? |
|---|---|---|---|
| G1-P01 | `veiculoZeroKm` não existe na matriz Java | default Sim esconde placa/RENAVAM | **sim** |
| G1-P02 | Credor Java obrigatório × live sem `*` (pré-preenchido) | inventário vs `BA.json` | **sim** |
| G1-P03 | `FUNDO_RESERVA_PREV` visível na Java, ausente no DOM | inventário | **sim** |
| G1-P04 | E-mail do contrato e seção Documentos só na Nova UX | inventário | **sim** (mapear ou aceitar extra) |
| G1-P05 | `DADOS_ADITIVO: true` não aparece na PAGE-02 | heading ausente | documentar como tela distinta; não “corrigir” Java nesta gate |
| G1-P06 | Bundle live (zero km = `nz-select`) ≠ HTML local (`nz-radio-group`) | DOM vs `veiculo-registro-form.component.html` | **sim** (qual SoT do front) |
| G1-P07 | Telefone único vs `TEL_DDD`+`TEL_NUMERO` | shape | aceitar adaptação de UX ou exigir dois campos |

## Riscos de UF

| ID | UF | Risco se a automação avançar agora | Decisão |
|---|---|---|---|
| G1-UF-MA | MA | spec feliz sem matriz = oráculo inventado | **não automatizar**; produto escolhe inativar combo ou criar matriz |
| G1-UF-SE | SE | combo ATIVO (id 229) vs skip `formularioIndisponivel` e id mock 27 | **não registrar**; produto alinha combo e skip |
| G1-UF-CE | CE | matriz existe, suíte não; form live desconhecido (TG visível na Java) | inspecionar leitura **depois** de aprovação; não copiar BA |
| G1-UF-RO | RO | idem, sem TG | idem |
| G1-UF-MS | MS | mock verde × HMG `servicoNaoContratado` | não apontar spec MS ao newfront sem política |
| G1-UF-22 | as 21 além de BA | combo ≠ form carregado | uma UF por gate |

## Segurança operacional (cumprida)

- persistGuard instalado no `beforeEach` antes do login.
- Auth em passthrough; mutações `/api/` abortáveis.
- Sem token/cookie/senha nos markdowns.
- Credor e CNPJ de agente redigidos.
- Chassi de teste `A` descartado via Excluir (linha não salva).
- Documentos: heading apenas; upload não disparado.

Risco residual: **Excluir veículo** em linha já persistida (não ocorreu). Se o botão passar a chamar API, o guard deve continuar abortando.

## Decisões necessárias antes de avançar

Não avançar PAGE-03..08, não criar Page Objects novos, não alterar fixtures/mocks e não abrir regressão live até o time escolher:

1. **SoT de veículo BA:** Nova UX (`veiculoZeroKm` + linha inline + Excluir) prevalece sobre a matriz Java e sobre o POM?
2. **MA no combo:** inativar, implementar matriz, ou marcar formulário indisponível?
3. **SE no combo (id 229):** inativar, implementar matriz, ou manter skip e aceitar combo “fantasma”?
4. **CE e RO:** autorizar Gate de inspeção live-readonly do form (sem persistir) antes de entrar em `DetranUf`?
5. **Credor / fundo de reserva / e-mail / documentos:** divergências viram bug de front, bug de matriz, ou extra aceito da Nova UX?
6. **Bundle vs repo:** o radio group versionado deve ser alinhado ao combobox implantado (ou o contrário) antes de gravar locators de regressão?

## Fora desta autorização (recusado de propósito)

- Commit / push
- Novos testes de regressão
- Alteração de Java, mock, fixture, POM de produção
- Persistência de veículo ou contrato
- Inspeção PAGE-03..08
- Abertura do formulário MA/SE/CE/RO
