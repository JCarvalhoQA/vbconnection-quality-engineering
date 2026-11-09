# Investigação SE (Sergipe) — Etapa 13

**Evidência:** `LIVE-FIELD-INVENTORY.json` → `ufs.SE`; `e2e/contratos/registro/registro-contrato.flow.ts` (`SE_SKIP`); `config/detransIds.ts`.

## O que a inspeção GATE3 mostrou

| Campo | Valor |
|---|---|
| idCombo | 229 |
| formularioDisponivel | **false** |
| matrizJava | false |
| headings | Registrar contrato, Destino, Documentos |
| fields | 1 (`Destino*`, `disabled: true`) |
| veículo / TG / credor | ausentes |
| documentos heading | true (casca) |

Não há Agente financeiro, Veículos, Contrato nem Devedor. O destino aparece no combo; o formulário PAGE-02 **não carrega**.

## Skip de registro

Texto versionado: *formularioIndisponivel — sem coluna na matriz Java e sem `fixtures/matriz/SE.json`. Não simular cadastro como DETRAN suportado.*

`DetranUf` inclui SE com **ID sintético 27** “só para o combo mockado”; comentário: *SE não possui enum no produto*.

## Diferenciação pedida

| Hipótese | Evidência | Conclusão |
|---|---|---|
| Regra de negócio que oculta o form | Destino existe; campo Destino desabilitado | Possível, não comprovada além da UI |
| Funcionalidade não implementada | Sem enum no produto; sem coluna Java | **Mais alinhada às fontes** |
| Erro de carregamento | Sem stack/HTTP de falha no inventário; headings estáveis de casca | Não suportada |
| Permissão | Inspeção foi Master; outras UFs carregaram no mesmo gate | Improvável |
| Divergência de configuração | idCombo 229 ≠ id sintético 27 do mock | Mock e live não compartilham ID |

## Classificação

`NOT_APPLICABLE` — formulário indisponível. **Não** é skip de um form que existe.

## Impacto / recomendação / status / limitação

Impacto: SE não entra nas 21. Mutation de SE é inválida.  
Recomendação: não inventar mock estrutural. Só reabrir se GATE live autorizado mostrar form completo.  
Status: skip mantido.  
Limitação: esta etapa **não** reexecutou live de SE (gates de segurança + credencial).
