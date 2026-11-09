# Auditoria de qualidade das assertions — Etapa 13

**Evidência:** `support/page02Structural.ts`, `pages/fragments/veiculoSection.ts`, `definirEstruturalPage02.ts`.

Forte = observa a propriedade. Parcial = só um lado da regra. Fraca = presença genérica. Ausente = não existe.

| # | Verificação | Mocked | Live | Notas |
|---|---|---|---|---|
| 1 | Remoção de campo esperado obrigatório | Ausente (casca) / Forte (chassi, gravame, placa) | Forte (`assertObrigatoriosVisuaisLive`) | Mocked não itera `*` da casca |
| 2 | Inclusão indevida de campo | Parcial (TG, Novo/usado, tipoEspecie) | Parcial | Cor e motor extras não falham |
| 3 | Alteração de obrigatoriedade visual | Ausente | Forte | Mutação `alter-asterisk` sobrevive no mocked |
| 4 | Remoção de seção | Parcial (6 mínimas) | Forte (headings do perfil) | Extra heading não-TG não falha |
| 5 | Exibição indevida de seção | Parcial (TG; agora Credor/Documentos no live) | Parcial | Headings extras genéricos Ausente |
| 6 | Valor inicial Zero km | Forte | Forte | `toContainText(default)` |
| 7 | Alternância Zero km | Forte | Forte | Sim↔Não + placa |
| 8 | Ausência de Placa/RENAVAM quando aplicável | Forte | Forte | visível no Não; hidden no Sim |
| 9 | Presença indevida de Novo/usado | Forte | Forte | `toHaveCount(0)` |
| 10 | Ausência de TG quando esperado | Forte | Forte | |
| 11 | Exibição indevida de TG | Forte | Forte | |
| 12 | Alteração inesperada do Credor | Ausente | Parcial→Forte heading | Campos internos do credor não iterados |
| 13 | Seção Documentos | Ausente no mocked | Parcial→Forte heading | |
| 14 | Falha no descarte de veículo | Forte | Forte | chassi hidden + “Nenhum veículo” |
| 15 | Formulário de outra UF | Parcial (nome do destino) | Parcial | Swap BA↔CE detectado; UFs idênticas podem sobreviver |

## Impacto

O caminho live é o que sustenta a casca. O mocked é forte em veículo/TG e fraco em asterisco.

## Recomendação

Não promover mocked a “paridade live” sem mock Angular fiel ao inventário.

## Status

Assertions de unicidade de veículo e ausência Credor/Documentos (live) reforçadas. Mutation score documentado.

## Limitação

Oráculo de mutação não abre browser; reflete o código das assertions, não o DOM live.
