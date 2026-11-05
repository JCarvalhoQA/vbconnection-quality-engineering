# Agrupamento por semelhança (sem colapsar regras)

Dois UFs no mesmo grupo **não** autorizam a mesma massa nem o mesmo assert de `*`. O grupo só reduz o custo de locators compartilhados.

## G0 — Sem formulário

| UF | id | Notas |
|---|---|---|
| SE | 229 | Combo ATIVO; PAGE-02 não abre Agente/Veículos. LIVE_UI confirma skip de produto. |

Não misturar com MA (MA **tem** form).

## G1 — Clone live CE

| UF | Campos | `*` | TG | Java |
|---|---|---|---|---|
| CE | 68 | 25 | sim | sim |
| MA | 68 | 25 | sim | **não** |

Labels da casca **idênticos** (`CE==MA`). Regras de pagamento local, celular e TG iguais no DOM.  
**Não** tratar MA como CE na suíte: sem matriz, sem `DetranUf`, risco de NPE no backend em persistência (não testada).

## G2 — TG + form largo (Java alinhado na existência de TG)

| UF | Campos | `*` | Destaque |
|---|---|---|---|
| ES | 58 | 21 | gravame sem `*` |
| PR | 64 | 22 | WebPKI depois da PAGE-02 |
| RJ | 70 | 25 | Cor\\*; maior casca |

Compartilham heading TG. **Não** compartilham o mesmo conjunto de `*` nem o mesmo veículo (RJ tem Cor\\*; PR tem catálogo completo).

## G3 — BA (única com Novo/usado)

Só BA. Motor opcional, ano oculto, índice `*`. Qualquer “grupo Nordeste” que inclua BA está errado.

## G4 — Veículo catálogo (marca bem / combustível / cor)

AC, AP, MG, RR (49/25, UF licenciamento).  
PB, PE, SC próximos, mas **sem** o mesmo `*` e PB/PE/SC diferem em Marca/modelo.  
SP (50/26) sem UF licenciamento no veículo.

Reutilizar locators de Situação do chassi / marca bem. **Não** reutilizar massa de `*`.

## G5 — Veículo enxuto

| UF | Campos | `*` |
|---|---|---|
| RO | 52 | 11 |
| MT | 45 | 17 |
| TO | 48 | 16 |
| DF | 50 | 20 |

Ano visível sem `*` (exceto o que cada UF marcar). Sem TG. RO é o mais frouxo.

## G6 — `*` alto, casca média

| UF | `*` | Risco |
|---|---|---|
| RN | 30 | massa “mínima” das outras UFs falha |
| MS | 27 | flag HMG `servicoNaoContratado` vs form live |
| SP | 26 | — |

## Componentes reutilizáveis (todas as 21)

- PAGE-02 single page (não wizard)
- Destino + Alterar destino
- Agente (CNPJ/Nome derivados)
- Veículos: tabela + linha inline + zero km + Excluir
- Credor sem `*`
- Documentos dropzone (não automatizar upload)
- `formcontrolname` colidem: sempre `#id` ou seção

## Divergências recorrentes (todas as UFs com form)

1. Java não modela `veiculoZeroKm`.
2. POM não preenche placa condicional.
3. Credor Java muitas vezes `[true,true]`; live sem `*`.
4. Documentos fora da matriz `MatrizDados*`.
5. Telefone = um campo vs DDD+número Java.
6. Mock combo 19 ≠ live 22.

## Não agrupar

- PR/RJ/TO só porque têm WebPKI (PAGE-02 igual às outras).
- MA com SE (combo “problemático”).
- BA com CE porque ambas são “Nordeste”.
