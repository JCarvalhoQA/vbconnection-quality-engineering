# Backlog priorizado — etapa 2 em diante

Itens de **código** aguardam aprovação explícita. Itens 0.x são evidência/leitura.

| ID | Item | Tipo | Pri | Depende | Persistência |
|---|---|---|---|---|---|
| E2-00 | Entregar este plano (este documento) | doc | P0 | — | não |
| E2-01 | Provisionar credencial **Master** em `.env` local | ops | P0 | gestor/QA | não |
| E2-02 | Gate 0: login Master, assert perfil, dump destinos-combo (GET) | evidência | P0 | E2-01 + aprovação live-readonly | GET only |
| E2-03 | Gate 0b: dump DOM PAGE-02 UF piloto **BA** sem POST | evidência | P0 | E2-02 | abort POST |
| E2-04 | Script gerador `fixtures/matriz/{UF}.json` ← `matriz-form.json` | código | P0 | **feito** 2026-11-05 | não |
| E2-05 | `mockContratoCadastroApis` lê fixture; SE faz skip | código | P0 | **feito** 2026-11-05 | mock |
| E2-06 | `ContratoFactory` + `validarCamposObrigatorios` obedecem fixture | código | P0 | **feito** 2026-11-05 | mock |
| E2-07 | Ajustar happy path: não preencher `TIPO_CONTRATO` se oculto | código | P0 | **feito** 2026-11-05 | mock |
| E2-08 | BA: `INDICA_NOVO_USADO`; não preencher ano fab se oculto | código | P1 | **feito** com E2-06/07 | mock |
| E2-09 | `test.skip` SE com `formularioIndisponivel` | código | P1 | **feito** com E2-05 | — |
| E2-10 | Tag `@mocked` vs `@live-readonly`; persistGuard | código | P0 | **feito** persistGuard mocked + live-readonly (Gate 0 skip) | abort |
| E2-11 | Persona Master no `login.ts` **sem** senha no JSON | código | P0 | E2-01 schema | env |
| E2-12 | `storageState` setup (gitignore `.auth/`) | código | P1 | E2-01, E2-02 | sessão |
| E2-13 | Escopar locators veículo (Salvar/Chassi) no modal | código | P1 | E2-03 | mock |
| E2-14 | Toast por texto, não `.last()` cego | código | P2 | — | mock |
| E2-15 | Dump PAGE-03/04 após Master | evidência | P1 | E2-02 | GET |
| E2-16 | POM aditivo / aditivo RS | código | P1 | E2-15 | abort POST |
| E2-17 | Dump PAGE-05..08 | evidência | P1 | E2-02 | sem upload |
| E2-18 | POM lote/imagem (validação de nome/tamanho, sem POST) | código | P1 | E2-17 | abort |
| E2-19 | CE/RO: só se destinos-combo live listar | evidência+código | P2 | E2-02 | GET |
| E2-20 | Credor + telefone + TG no POM | código | P1 | E2-03 dump | mock |
| E2-21 | Mock 5xx/timeout em `contratos/registrar` | código | P1 | E2-05 | mock |
| E2-22 | `data-testid` (front) toggle senha / expirada | front | P2 | autorização Angular | — |
| E2-23 | Versionar fonte Nova UX ou mapa de IDs no publish | ops | P1 | time front | — |
| E2-24 | Confirmar MS `servicoNaoContratado` no HMG | evidência | P2 | E2-02 | GET |

## Fora de backlog (recusado nesta fase)

- Registro real de contrato/aditivo/lote.
- Envio DETRAN/B3.
- Alterar senha da massa ADMINISTRADOR.
- Tratar ADMINISTRADOR como Master.
- 19× cenários usado/novo.
- Implementar UN.
- Forçar suporte a SE.
- Commit/push.

## Definição de pronto de um item de código

- Não grava negócio.
- Test-compile/playwright do recorte passa.
- Fixture cita origem Java.
- Relatório sem senha/token.
- UF sem evidência não entra como “suportada”.
