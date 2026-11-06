# Cobertura estrutural PAGE-02 — CE

**Fonte visual:** `LIVE-FIELD-INVENTORY.json` (Gate 2).  
**Não** usa a matriz Java para sobrescrever a UI.  
**Não** entra em `DetranUf` / suíte de registro.

## Specs

| Modo | Arquivo | Status local |
|---|---|---|
| `@mocked` | `e2e/contratos/page02/ce-estrutural.spec.ts` | passed 8,3s |
| `@live-readonly` | mesmo arquivo, gated por `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1` | listado; **não executado na CI desta etapa** |

Destino mock/live: `DETRAN-CE` · id combo **236**.

## O que o teste cobre

Comum: Master (live) ou sessão mockada · PAGE-02 · destino CE · seções · linha de veículo · Chassi/Gravame · Zero km Sim → Não (UF placa, Placa, RENAVAM) · ausência de Novo/usado · descarte sem Salvar/Registrar · persistGuard.

Específico CE (live / inventário):

- Seção **Terceiro Garantidor** visível, 12 campos, **0** `*` visual.
- Taxa juros mês (%)* · Data / época / UF+cidade de pagamento* · Celular do devedor*.
- Ano fabricação* na linha de veículo.
- Credor e Documentos presentes.

Mocked: casca mínima + TG + veículo + descarte. Asteriscos live **não** são impostos no mock, porque o form mockado segue a matriz Java.

## Homologação funcional

**Não.** O passed estrutural não homologa regra de negócio, submit nem DETRAN.
