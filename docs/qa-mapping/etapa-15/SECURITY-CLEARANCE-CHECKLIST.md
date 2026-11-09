# Checklist de regularização da credencial Master

**Classificação:** `BLOCKED_SECURITY_CREDENTIAL_ROTATION`

Não é `SECURITY_CLEARED` (rotação não comprovada).  
Não é `SECURITY_RISK_ACCEPTED` (não há decisão formal versionada).  
Não é só `SECURITY_EVIDENCE_INSUFFICIENT`: o timestamp do secret **foi** consultado e é anterior ao incidente.

## Evidências administrativas (2026-11-09, pós-PR #14)

| Verificação | Resultado |
|---|---|
| Senha rotacionada após o incidente (run 42220549160, 2026-11-06)? | **Não comprovado** |
| Secret atualizado depois da rotação? | `PLAYWRIGHT_MASTER_PASSWORD` `updated_at` **2026-11-05T18:14:39Z** — anterior ao vazamento; inalterado após o PR #14 |
| Decisão formal de segurança? | Ausente neste repositório |
| Autorização para novo live? | **Não** — bloqueio mantido |
| Environment protegido? | Sim: `required_reviewers` (JCarvalhoQA) + `branch_policy` |
| Secrets no Environment (não no repositório)? | Sim; `gh secret list` do repositório vazio |
| Artifacts live sanitizados no YAML? | Sim: `sanitize-live-artifacts.mjs`; upload sem `trace.zip`/vídeo |

Valor do secret **não** foi lido. Senha **não** foi alterada. Environment approval **não** conta como rotação.

## Ações manuais do responsável autorizado

1. Rotacionar a senha Master no VBConnection (invalidar a senha antiga, não só deixar expirar).
2. Atualizar `PLAYWRIGHT_MASTER_PASSWORD` no Environment `live-readonly` **depois** da rotação.
3. Registrar data/hora da rotação e do `updated_at` do secret (sem gravar a senha).
4. Confirmar que o artifact 42220549160 não permanece acessível a quem não deveria, ou foi expirado/removido conforme política.
5. Só então autorizar o `workflow_dispatch` live `ufs=MA,TO` na `main`.

`AUTH_PASSWORD_EXPIRED` permanece: interromper, não trocar senha automaticamente, não logar credencial.
