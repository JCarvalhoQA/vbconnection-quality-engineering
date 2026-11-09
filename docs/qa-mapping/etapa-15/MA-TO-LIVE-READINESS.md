# Prontidão live MA/TO

```text
Selected UFs: MA,TO
Expected tests: 2
Execution mode: live-readonly
Branch: main
Security status: BLOCKED_SECURITY_CREDENTIAL_ROTATION
Environment approval: required
Ready for manual dispatch: NO
```

**Motivo do NO:** secret Master sem evidência de rotação após o vazamento. `MA_TO_LIVE_PENDING`.

## Seleção validada (`--list`, sem executar)

```text
npx playwright test --project=vbconnection-newfront e2e/contratos/page02/ma-estrutural.spec.ts e2e/contratos/page02/to-estrutural.spec.ts --grep "@live-readonly" --list
```

Total: **2 tests in 1 file** (`definirEstruturalPage02.ts`). Cenários `@live-readonly` estruturais; nenhum registro persistente.

## Comando para o responsável (somente após regularização)

```bash
gh workflow run playwright-tests.yml \
  --ref main \
  -f mode=live-readonly \
  -f suite=structural \
  -f target=newfront \
  -f ufs=MA,TO
```

Pré-requisitos: SHA da `main` com workflow atual, Environment `live-readonly` aprovado, `workers=1` / `retries=0`, persistGuard, credencial rotacionada.

Este agente **não** disparou o workflow.
