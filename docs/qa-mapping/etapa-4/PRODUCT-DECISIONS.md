# Decisões funcionais — evolução da automação

**Data:** 2026-11-05  
**Escopo:** após Gate 2 (BA + CE + RO live-readonly)  
Nenhuma decisão abaixo foi executada.

## Pode afirmar agora

1. CE e RO **carregam** PAGE-02 no newfront (combo ATIVO não era só enfeite).
2. A Nova UX de veículo é **uma** (linha + zero km + Excluir) nas três UFs; o que muda é o **conjunto de campos** e o `*`.
3. `indicaNovoUsado` é regra **só BA**, confirmada também pela ausência em CE/RO.
4. Terceiro garantidor na PAGE-02 é regra **só CE** (visível e opcional).
5. CE/RO **não** devem entrar na suíte Playwright nesta sprint: `DetranUf`, POM e massa ainda descrevem outro contrato de UI.

## Decisões que bloqueiam a automação

### D1 — SoT de veículo

A matriz Java não conhece `veiculoZeroKm`. O POM não preenche placa/UF/RENAVAM. O live esconde esses campos enquanto zero km = Sim.

- **Opção A:** Nova UX é SoT; Java/fixture ganham a regra depois (sem alterar agora).
- **Opção B:** front deve exibir placa sempre, como a matriz.

Sem D1, qualquer spec feliz live de veículo está errada nas três UFs.

### D2 — Incluir CE/RO na suíte?

Gate 2 **não** autoriza `DetranUf` + spec. Só autoriza evidência.

- **A:** permanecer fora da suíte; cobertura = documentação + inspect gated.
- **B:** Gate 3 de POM/massa **por UF**, ainda sem persistência live, só mock.
- **C:** persistência live — recusado (DETRAN/B3).

Recomendação SDET: **A** até D1 e locators de veículo/TG serem adotados no POM.

### D3 — Ano fabricação `*` na CE

Java `[true, false]`; live `Ano fabricação*`. Angular provavelmente força obrigatoriedade em alguns DETRANs.

- Bug de front, bug de matriz, ou extra aceito?

### D4 — Credor RO

Java `END_UF` / `END_MUNICIPIO` obrigatórios; live sem `*` (Master pré-preenche, como BA).

- Assertar Java, assertar live, ou tratar credor como sessão?

### D5 — TG CE vazio no Registrar

Java e live: opcional. Saber se o backend rejeita TG vazio exige **Registrar** → BLOQUEADO.

- Produto declara “TG opcional de verdade” por escrito, sem teste persistente.

### D6 — Documentos

Dropzone nas três UFs. Java não modela. Upload continua proibido.

- Seção informativa vs obrigatória por UF: PENDENTE / BLOQUEADO (upload).

### D7 — MA / SE (fora desta gate, ainda abertos)

Combo live ATIVO. Sem inspeção de form. Não misturar com CE/RO (estes têm matriz).

## O que a automação **não** deve fazer agora

- Specs `ce.spec.ts` / `ro.spec.ts` de registro.
- Expandir `DetranUf`.
- Patch de mock para fingir Nova UX.
- Copiar massa BA para CE/RO.
- Cenários “veículo usado” em CE/RO.
- Assert `*` de índice como na BA.
- PAGE-03..08.
- Commit / push.

## Ordem sugerida (após as decisões)

1. Fechar D1 (zero km) e D3 (ano CE) — mudam locators de veículo.
2. Atualizar POM **só** quando autorizado, ainda mockado, UF a UF.
3. CE mock: TG opcional + campos extras de contrato/pagamento/celular.
4. RO mock: form curto, sem TG, sem `*` de datas.
5. Live-readonly de regressão **sem** Registrar, se ainda fizer sentido.
6. MA/SE: decisão de combo **antes** de inspecionar form.

## Segurança desta gate

persistGuard ativo · MASTER confirmado duas vezes · linhas de veículo descartadas · TG sem PII · `abortados: []` · nenhum registro.
