# Auditoria de locators — Etapa 13

**Evidência:** grep `waitForTimeout` / `.first()` / `force: true` em `pages/`, `support/`, `e2e/contratos/page02/`.

## Achados

| Padrão | Onde | Risco | Ação |
|---|---|---|---|
| `.first()` em chassi/placa/gravame/renavam | `VeiculoSection` | Duas linhas abertas escolhem a primeira em silêncio | **Corrigido:** `toHaveCount(1)` + locator sem `.first()` |
| `tipoEspecie` só se listado | `expectCampoInventario` | Inclusão indevida passava | **Corrigido:** ausência com `toHaveCount(0)` |
| Host NG-ZORRO `${tag}#id` | `ngZorroField` | ID duplicado no input interno | Já contextualizado; testes lote 4/5 |
| Overlay Zero km `.cdk-overlay-pane` | `definirZeroKm` | Texto instável em outro overlay | Mantido: opção `exact` + `.last()` no pane |
| `force: true` no submit | `ContratoPage.enviarContrato` | Clique fora do hit-test | Sem mudança: só registro mocked |
| `.first()` em gates 0–3 / liveInspect | inspeção histórica | Ambiguidade | Fora da suíte das 21; não reescrito |
| `waitForTimeout` / `networkidle` | suíte estrutural | flake | **Ausente** no caminho PAGE-02 factory |

## Falha que a correção previne

Dois chassis visíveis (linha não descartada + nova linha) agora falham em `toHaveCount(1)` em vez de validar só o primeiro.

## Impacto / recomendação / status / limitação

Impacto: detecção de duplicidade na linha de veículo.  
Recomendação: não espalhar `toHaveCount(1)` em gates históricos sem reexecução live.  
Status: alterações validadas na regressão mocked (100 passed).  
Limitação: `confirmar.first()` no dialog de exclusão permanece (botões Sim/Excluir). Overlay Zero km ainda usa `.last()`.
