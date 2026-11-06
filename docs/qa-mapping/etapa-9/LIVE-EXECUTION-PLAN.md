# Plano de execução live — pós-merge

**Não executar nesta branch/PR.**

Pré-requisitos:

1. Merge na `main`.
2. Confirmação documentada da rotação da senha Master (hoje: `BLOCKED_SECURITY_CREDENTIAL_ROTATION`).
3. Secret `PLAYWRIGHT_MASTER_PASSWORD` com `updated_at` posterior à exposição.
4. Aprovação humana do Environment `live-readonly`.
5. persistGuard inalterado.
6. `npx playwright test ... --list` conferindo 4 testes do lote 2.

Sequência sugerida:

```text
mode=live-readonly suite=structural target=newfront ufs=BA,CE,RO,AC,AP,DF,ES
mode=live-readonly suite=structural target=newfront ufs=MG,MS,MT,PB
```

Esperado no lote 2: 4 passed, retries=0, persistência bloqueada.  
Não classificar como homologação funcional de registro.
