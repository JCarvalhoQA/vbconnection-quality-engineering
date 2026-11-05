# Etapa 2 — Preparação (sem implementação)

**Data:** 2026-11-05  
**Autorização vigente:** análise técnica e documentação. **Não** implementar POM, fixtures, testes nem alterar arquivos executáveis até aprovação deste plano.  
**Não** commitar nem fazer push.

## Diagnóstico em uma frase

A suíte atual prova que o **mock** responde; não prova que a **Nova UX real** nem a **matriz Java** se comportam assim. Há **515 divergências** mock×Java nas 18 UFs sobrepostas, **SE não é DETRAN de formulário**, **CE/RO existem no backend e não na suíte**, e **Master ainda não autenticou** no newfront.

## Entregáveis desta pasta

| Documento | Conteúdo |
|---|---|
| [UF-RECONCILIATION.md](./UF-RECONCILIATION.md) | Por que existem 21 arquivos; SE, CE, RO, UN |
| [DIVERGENCES.md](./DIVERGENCES.md) | Java × mock × Nova UX |
| [MOCK-FIXTURES.md](./MOCK-FIXTURES.md) | Onde o mock é homogêneo; desenho das fixtures por UF |
| [LOCATOR-REVIEW.md](./LOCATOR-REVIEW.md) | Os 33 locators + extras: estabilidade e origem |
| [AUTH-MASTER.md](./AUTH-MASTER.md) | `.env` Master, sem segredos; ADMINISTRADOR ≠ Master |
| [COVERAGE-MATRIX.md](./COVERAGE-MATRIX.md) | O que cada evidência realmente cobre |
| [SCENARIO-REVIEW.md](./SCENARIO-REVIEW.md) | P0/P1, lacunas, o que ainda é hipótese |
| [POM-FIXTURES-PLAN.md](./POM-FIXTURES-PLAN.md) | Arquitetura incremental, sem sobrescrever o que funciona |
| [BACKLOG.md](./BACKLOG.md) | Backlog priorizado |
| [ENTRY-CRITERIA.md](./ENTRY-CRITERIA.md) | Bloqueios, dependências e critérios para começar a automatizar |

Evidência numérica: `../evidence/mock-vs-java.json` (derivado de `matriz-form.json` × `contratoCadastroMocks.ts`).

## Sequência recomendada (após aprovação)

1. **Gate 0 — evidência real (somente leitura):** credencial Master em `.env` local → confirmar `perfil=MASTER` em `/auth/prefs2` → dump de destinos do combo (GET) → inspecionar PAGE-02 em **uma** UF piloto sem POST.
2. **Gate 1 — fixtures por UF** a partir de `matriz-form.json`, só para UFs com evidência de destino real **ou** explicitamente marcadas como mock-only.
3. **Gate 2 — alinhar asserts do POM** ao que a matriz (e depois o DOM) dizem; hoje o teste exige `Tipo de Contrato` para SP, e a matriz Java marca `TIPO_CONTRATO` **oculto** em SP.
4. **Gate 3 — PAGE-03/04/05–08** só depois de locators Nova UX confirmados no DOM (hoje são v2/`INFERIDO`).

Nenhuma dessas gates está autorizada neste turno.
