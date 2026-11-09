# Validação live MA e TO — Etapa 15

**Status:** `MA_TO_LIVE_PENDING`

## Histórico consultado

`gh run view` + `workflow_dispatch` em 2026-11-09:

- Nenhum job live-readonly com `ufs=MA,TO`.
- Último live na `main`: [42281730173](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42281730173) (RR,RS,SC,SP).
- Mocked local desta etapa: MA e TO **aprovados** na suíte estrutural PAGE-02. Isso **não** substitui live.

## Bloqueio de segurança

O disparo live **não** foi feito nesta etapa.

Motivo: `BLOCKED_SECURITY_CREDENTIAL_ROTATION`. O secret `PLAYWRIGHT_MASTER_PASSWORD` do Environment `live-readonly` tem `updated_at` **2026-11-05T18:14:39Z**, anterior ao artifact com exposição de senha (run [42220549160](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42220549160)).

Expiração periódica da senha Master **não** comprova invalidação da credencial antiga. Aprovação do Environment, sozinha, **não** encerra o incidente. Não há aceite formal de risco versionado neste repositório.

`AUTH_PASSWORD_EXPIRED` permanece: interromper, não alterar senha, não imprimir credencial.

## Parâmetros para o responsável autorizado (após rotação comprovada)

Sintaxe real do input `ufs`: lista CSV sem espaços obrigatórios. Vazio = as 21 UFs implementadas.

```text
gh workflow run playwright-tests.yml --ref main -f mode=live-readonly -f suite=structural -f target=newfront -f ufs=MA,TO
```

Requer: branch `main`, Environment `live-readonly` aprovado, secret rotacionado **depois** de 2026-11-06, `workers=1`, `retries=0`.

Critério esperado (somente após execução):

```text
Total: 2
Passed: 2
Failed: 0
Skipped: 0
Flaky: 0
Retries: 0
```

Não declarar aprovado antes do run.

## O que o live de MA/TO deve observar

- Autenticação Master
- Seleção MA (idCombo 238) e TO (idCombo 122)
- Formulários do inventário
- `*` visuais, Zero km, Chassi/Gravame, condicionais
- TG e pagamento/juros de MA
- Credor e Documentos
- Descarte da linha / zero persistência

Inspeção estrutural ≠ registro funcional.
