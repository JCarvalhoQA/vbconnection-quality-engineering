# Bahia — formulário de inclusão de veículo (PAGE-02)

**Status:** OBSERVADO LIVE (sem persistir)  
**Data:** 2026-11-05  
**Confiança:** CONFIRMADA_LIVE para o que o DOM mostrou; código Angular local citado só como apoio  
**Tipo de UI:** **formulário inline na tabela**, não `ant-modal` / `role=dialog`

## Como abrir e como descartar

1. Na seção **Veículos**, clicar **Adicionar veículo**.
2. A tabela deixa o estado “Nenhum veículo” e abre uma linha editável.
3. Enquanto a linha está aberta, **Adicionar veículo** fica **desabilitado**.
4. Não existe botão **Cancelar**.
5. **Salvar** permanece visível — **não clicado** nesta inspeção.
6. Descarte reversível: **Excluir veículo** na linha ainda não persistida. Após o clique, a tabela volta a “Nenhum veículo”.

O Gate 0 tratou este fluxo como “modal”. O Gate 1 corrige: é expansão de linha. Locators que esperam `getByRole('dialog')` falham.

## Campos visíveis — zero km = Sim (default)

| Nome funcional | `formcontrolname` | Tipo | Obrig. visual | maxLength | Máscara / formato | Locator Playwright preferencial |
|---|---|---|---|---|---|---|
| Chassi | `chassi` | `input` text | sim (`*`) | 21 | texto; placeholder `Chassi` | `article` Veículos → `getByRole('textbox', { name: /^Chassi/i })` |
| N° gravame/restrição | `restricao` | `input` text | sim | 8 | tooltip de gravame; código Angular usa `mask="00000000"` | seção Veículos → textbox `/gravame\|restrição/i` |
| Veículo zero km? | `veiculoZeroKm` | `nz-select` (combobox) | **não** | — | Sim / Não; default **Sim** | `getByRole('combobox', { name: /Veículo zero km/i })` |
| Novo / usado | `indicaNovoUsado` | `nz-select` | **sim** | — | Novo, Usado | `getByRole('combobox', { name: /Novo\s*\/\s*usado/i })` |
| Número motor | `numeroMotor` | `input` text | não | não observado | texto livre | seção Veículos → textbox `/Número motor/i` |

Radios e checkboxes no inventário live: **nenhum**. O `readonly` no `nz-select` de zero km é o input interno do Ant Design (o overlay abre; opções foram lidas).

IDs nativos são **instáveis**: padrão `{campo}-veic-{timestamp}-{n}` (ex.: `veiculoChassi-veic-1793893094631-1`). Não usar `id` como locator principal.

## Campos que aparecem — zero km = Não

| Nome funcional | `formcontrolname` | Tipo | Obrig. visual | Notas |
|---|---|---|---|---|
| UF da placa | `uf` | `nz-select` | não | colisão de `formcontrolname=uf` com Devedor/Credor/liberação |
| Placa | `placa` | `input` | não | tooltip no template: obrigatório para já emplacados |
| RENAVAM | `renavam` | `input` | não | template Angular: `mask="00000000000"` |

Os três somem de novo se zero km voltar para Sim (código Angular limpa `uf`/`placa`/`renavam`). **Não persistido**; só observado o estado Não.

## `INDICA_NOVO_USADO`

| Pergunta | Evidência live | Java BA | Mock BA |
|---|---|---|---|
| Existe? | sim, combobox **Novo / usado\*** | `INDICA_NOVO_USADO` visível | mesma fixture `[true, true]` |
| Obrigatório visual? | sim | `[true, true]` | espelha Java |
| Valores | Novo, Usado | não enumera labels | não enumera labels |
| Condiciona outros campos? | **não** (Novo e Usado têm o mesmo conjunto) | não modela zero km | não modela zero km |

A regra condicional de placa/RENAVAM/UF **não** está em Novo/Usado; está em **Veículo zero km?**.

## Regras novo / usado / zero km

| Seleção | Campos extras | Confiança |
|---|---|---|
| Novo / usado = Novo, zero km = Sim | nenhum além dos 5 | CONFIRMADA_LIVE |
| Novo / usado = Usado, zero km = Sim | idêntico aos 5 | CONFIRMADA_LIVE |
| Zero km = Não (qualquer Novo/Usado) | UF da placa, Placa, RENAVAM | CONFIRMADA_LIVE |
| Obrigatoriedade funcional de placa/UF quando não zero km | código Angular chama `obrigarCamposPlacaUf()`; live **sem** `*` no label | PENDENTE (não houve blur de validação nesses campos) |
| RENAVAM obrigatório | Java `[true, false]`; Angular: nunca required da matriz, só min/max 9–11 se não zero km | PENDENTE live / CONFIRMADA_JAVA |

Ano fabricação / ano modelo / situação do chassi / marca / combustível / categoria / cor / UF licenciamento: **não apareceram** na BA live, alinhado à matriz Java (`visivel=false`).

## Validações observadas com segurança

| Ação | Resultado | Persistência |
|---|---|---|
| Chassi = `A` + Tab | nenhum span de padrão I/O/Q; campo permanece com `*` de rótulo | não |
| Abrir overlay Novo/usado | Novo, Usado | não |
| Abrir overlay zero km | Sim, Não | não |
| Salvar | **não executado** | — |
| Excluir linha aberta | tabela volta a “Nenhum veículo” | nenhuma mutação abortada (`abortados: []`) |

Mensagem “Chassi não pode conter as letras I, O ou Q” existe no template Angular; **não** foi disparada (entrada `A` é válida). Texto exato live: PENDENTE.

## Ações da linha

| Botão | Visível | Clicado | Risco |
|---|---|---|---|
| Salvar | sim | **não** | persistiria o veículo no form (ainda sem Registrar contrato) |
| Cancelar | **não** | — | POM/cenários que esperam Cancelar vão falhar |
| Excluir veículo | sim | sim (linha não salva) | descarte local; se o produto passar a POST neste botão, persistGuard deve abortar |
| Adicionar veículo (com linha aberta) | sim, **disabled** | não | — |

## Divergência código local × newfront

O HTML versionado em `veiculo-registro-form.component.html` declara **Veículo Zero KM?** como `nz-radio-group`. O newfront live renderiza **combobox** `nz-select` (`id` prefixo `zeroKm-`). Tratar o live como SoT de automação; o radio group é evidência de código, não do bundle implantado.

## Escopo recusado

Não confirmar inclusão. Não preencher chassi completo. Não enviar ao DETRAN.
