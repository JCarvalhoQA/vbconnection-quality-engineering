# Fixtures de matriz por UF

Geradas por `npm run matriz:generate` a partir de `docs/qa-mapping/evidence/matriz-form.json`.

- `[visivel, obrigatorio]` espelha `Boolean[]` do Java.
- `secoes` espelha `GET /api/form/detran/{id}` (`anyMatch` campo visível).
- `fonteHash` é SHA-256 (16 hex) do JSON-fonte — o gerador é determinístico (sem timestamp).
- **SE** não possui arquivo: sem coluna na matriz Java (`formularioIndisponivel`).
- **CE** e **RO** têm arquivo (Java), mas `naSuitePlaywright: false` até evidência no destinos-combo.

Não afirmar paridade com a Nova UX real: estas fixtures são **CONFIRMADO_CODIGO**, usadas só no mock.
