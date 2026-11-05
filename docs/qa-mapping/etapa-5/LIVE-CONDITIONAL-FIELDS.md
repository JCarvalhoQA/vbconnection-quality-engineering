# Campos condicionais — PAGE-02 live

**Classe:** LIVE_UI (interação reversível) salvo onde indicado.

## Grupo A — `veiculoZeroKm` (21 UFs com form)

| Estado | Efeito | Evidência |
|---|---|---|
| Default | **Sim** | LIVE_UI |
| Sim | UF da placa, Placa e RENAVAM **ocultos** | LIVE_UI |
| Não | os três **aparecem**, sem `*` visual | LIVE_UI |
| Voltar Sim | os três somem de novo | LIVE_UI (Gate 2/3) |

Não existe na matriz Java (`JAVA` ausente). POM não trata (`MOCK`/código).  
Novo/usado **não** controla esse grupo (BA: Novo vs Usado com zero km Sim = mesmo conjunto).

SE: grupo **não aplicável** (sem linha de veículo).

## Grupo B — Novo / usado

| UF | Visível | Obrigatório visual | Condiciona outros campos |
|---|---|---|---|
| BA | sim | sim | **não** (LIVE_UI) |
| Demais com form | não | — | — |
| SE | n/a | — | — |

`JAVA`: `INDICA_NOVO_USADO` `[true,true]` só BA — alinhado ao live.

## Grupo C — UF → Cidade

Devedor: Cidade **disabled** até UF nas UFs inspecionadas com endereço (padrão LIVE_DOM).  
TG (quando existe): Cidade TG disabled até UF TG.  
CEP focusout (`buscarCep`): **não exercitado** — PENDENTE / risco de GET.

## Grupo D — Terceiro garantidor

Visível **somente** após destino CE, ES, MA, PR ou RJ.  
Não dependeu de tipo de restrição, veículo ou documentos nesta inspeção (LIVE_DOM pós-seleção).  
Campos do bloco: todos sem `*` (CE/MA 12 campos).  
JAVA: CE ES PR RJ true; **MA não existe na matriz**.

## Grupo E — Destino locked

Após selecionar UF, Destino disabled. Troca: **Alterar destino** ou novo `goto` PAGE-02 (Gate 3 usou reinício da página). Não reabrir o combo disabled.

## Grupo F — Linha de veículo

Adicionar veículo disabled enquanto a linha está aberta.  
Salvar **não clicado**. Descarte: Excluir veículo (não há Cancelar).  
Se a linha já persistida: BLOQUEADO (não ocorreu).

## O que não é condicional (recorrente)

- Documentos: heading+dropzone nas 21 com form, independente de veículo salvo.
- Credor: presente nas 21, sem `*` visual, independente de zero km.
- Tipo de Contrato: presente em CE/MA/RO e várias outras; **ausente na BA** — é regra de UF, não de clique.

## PENDENTE / BLOQUEADO

| Tema | Por quê |
|---|---|
| Placa obrigatória funcional se não zero km | Angular `obrigarCamposPlacaUf`; live sem `*` | PENDENTE |
| TG vazio no Registrar | exigiria persistir | BLOQUEADO |
| Trava UF PR/PB (texto alerta) | não disparada (não preencheu endereço) | PENDENTE |
| WebPKI PR/RJ/TO | PAGE-02 carregou sem certificado | certificado só em fluxos posteriores BLOQUEADO |
