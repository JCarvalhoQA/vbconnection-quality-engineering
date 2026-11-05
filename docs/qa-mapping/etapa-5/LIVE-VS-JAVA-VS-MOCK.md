# 22 UFs — Nova UX × Java × mock

**Sem alteração** de `MatrizDados*`, fixtures ou `contratoCadastroMocks.ts`.

## Combo e form

| Tema | LIVE | JAVA | MOCK / suíte | Classe |
|---|---|---|---|---|
| 22 destinos ATIVO | sim | 20 colunas + enum extra UN | 19 (`DetranUf` + SE id 27) | INCOMPATÍVEL conjuntos |
| SE form | **não carrega** | sem coluna | skip `formularioIndisponivel` | LIVE_UI confirma MOCK skip; combo ainda lista SE |
| MA form | **carrega = CE** | **sem coluna** | ausente | INCOMPATÍVEL live extra |
| CE/RO form | carregam | colunas sim | fora de `DetranUf` | LIVE+JAVA vs MOCK suíte |
| UN | fora do combo | enum sem coluna | ausente | alinhado na ausência de PAGE-02 |

## Regras transversais

| Tema | LIVE (21 forms) | JAVA | MOCK/POM | Classe | Impacto |
|---|---|---|---|---|---|
| `veiculoZeroKm` | default Sim, condicional placa | ausente | POM não preenche placa | INCOMPATÍVEL | toda spec feliz live |
| Novo/usado | só BA | só BA `[true,true]` | factory só BA | alinhado | não copiar 19× usado |
| TG | CE ES MA PR RJ | CE ES PR RJ | fixture se seção true | MA extra LIVE | não skip TG-MA como Java |
| Credor `*` | nenhum | várias UFs `[true,true]` | POM não preenche | INCOMPATÍVEL visual | não assertar `*` credor |
| Documentos | dropzone | não modelado | não | LIVE extra | não upload |
| Telefone | 1 campo | DDD+número | — | INCOMPATÍVEL shape | locators `#devedorTelefone` |
| Linha vs dialog | inline + Excluir | n/a | POM Chassi placeholder ok | INCOMPATÍVEL UI parcial | reescrever fluxo veículo |

## Recortes que a suíte 19 vai mentir se for para o newfront

| UF | Mentira provável do mock/POM atual |
|---|---|
| Todas 19 | zero km / placa |
| BA | alinhada em Novo/usado; POM ainda pode preencher ano oculto |
| SE | spec skip ok; combo live ainda oferece SE |
| CE/RO/MA | **inexistentes** na suíte — gap de cobertura, não falso verde |
| MS | spec passa no mock; HMG “não contratado”; **form live existe** |
| PR/RJ/TO | PAGE-02 sem WebPKI; certificado não prova cadastro |
| ES/PR/RJ | TG na Java: POM só procura heading se fixture true — ok no mock, não provado live |

## Ação recomendada (não executada)

1. Não expandir `DetranUf` nesta gate.
2. Tratar inventário live (`LIVE-FIELD-INVENTORY.json`) como SoT de **presença visual**.
3. Java continua SoT de **contrato de API** `GET form/*` até alguém reconciliar zero km/MA.
4. Mock continua SoT dos testes **mockados** — não homogeneizar com os 22 destinos agora.
