# Proposta de arquitetura Playwright (fundamentada no live)

**Status:** núcleo PAGE-02 implementado na Etapa 6 (piloto BA). Ver `docs/qa-mapping/etapa-6/ETAPA6-RESULT.md`.  
**SoT visual:** `LIVE-FIELD-INVENTORY.json` + Gates 1–3  
**SoT API:** matriz Java / fixtures atuais, até reconciliação

## Princípios

1. **Um contrato de página**, muitos **perfis de UF** — não 22 Page Objects.
2. **Dois mundos de teste:** `@mocked` (CI) e `@live-readonly` (inspeção). Nunca misturar persistência live.
3. **Presença no combo ≠ perfil de form.** SE não tem perfil. MA tem perfil live sem Java.
4. Locators do núcleo (Destino, Agente, Chassi, zero km, Excluir) são compartilhados; asserts de `*` vêm do **perfil**, não do POM.

## Camadas sugeridas (quando autorizado)

```
support/persistGuard.ts          # já existe — obrigatório em live
fixtures/matriz/{UF}.json        # Java — não homogeneizar com live agora
docs/.../LIVE-FIELD-INVENTORY.json  # perfil visual (novo SoT)

pages/contratoPage.ts            # núcleo: destino, agente, veículo inline, submit
pages/fragments/veiculoLinha.ts  # zero km, placa condicional, Excluir (não dialog)
pages/fragments/terceiroGarantidor.ts  # só se perfil.tg === true

config/ufProfile.ts              # merge: javaFixture + liveOverlay + flags
```

`ufProfile(uf)` proposto (campos, não código agora):

- `formularioDisponivel` (SE false)
- `javaDisponivel` (MA false)
- `naSuite` (CE/RO/MA false hoje)
- `tg`, `indicaNovoUsado`, `zeroKm: true`
- `requiredVisual: string[]` a partir do inventário live
- `veiculoCampos` default vs não-zero-km
- `requerWebPki` (PR/RJ/TO) — **não** na PAGE-02

## O que o POM deve passar a fazer (depois de aprovação)

| Hoje | Proposta |
|---|---|
| Clique Adicionar + placeholder Chassi | igual, âncora `article` Veículos |
| Situação do chassi se `REMARCADO` | manter gate Java; não falhar se ausente no live |
| Novo/usado se matriz | manter — só BA |
| — | **novo:** `veiculoZeroKm` Sim/Não; placa só se Não |
| — | Excluir para teardown live-readonly |
| expect dialog/Cancelar | **remover** se alguém adicionar |
| `DetranUf` 19 | **não expandir** até overlay live + massa por grupo |

## Massa

- Núcleo compartilhado: destino, agente, número contrato, CPF/nome/UF/cidade.
- Complemento **por grupo** (G1 CE/MA, G2 TG, G3 BA, G5 enxuto, G6 `*` alto).
- Nunca uma factory única “19 UFs iguais”.
- Live: **não** persistir; asserts = visibilidade e `*`.

## Suites

| Job | UFs | Persistência |
|---|---|---|
| mocked CI | 18 overlap Java∩Playwright, SE skip | mock + persistGuard mocked |
| live-readonly (manual/gated) | 21 forms, SE espera sem form | aborta POST `/api/` |
| live-mutating | **nenhum** até autorização DETRAN | — |

Não criar `ce.spec.ts` / `ma.spec.ts` / `ro.spec.ts` agora.

## Ordem de implementação sugerida

1. Decisão de produto: MA (manter clone / criar matriz / inativar) e SE (tirar do combo).
2. Fragmento de veículo (zero km) no POM, coberto **só no mock** com fixture estendida — ou overlay live no perfil, sem fingir Java.
3. Asserts de `*` lidos do inventário live para um piloto (BA).
4. CE mock + TG opcional, ainda fora de `DetranUf` se o combo mock não listar CE.
5. Só então discutir incluir CE/RO no tipo `DetranUf`.

## Fora de escopo

PAGE-03..08, WebPKI, upload, B3, alterar fixtures nesta gate.
