# Cobertura de automação

Status de automação é **mutuamente exclusivo** e totaliza 83. Polaridade (positivo/negativo) e tipo (estrutural/funcional) são eixos à parte.

## Por status de automação (83 lógicos)

| Status | Qtd | IDs / recorte |
|---|---:|---|
| Automatizado | 42 | Spec Playwright exerce a intenção (inclui CT-052 e CT-053, etapa 16) |
| Parcialmente automatizado | 4 | CT-036, CT-038, CT-048, CT-049 |
| Apenas mapeado | 30 | CT-012; CT-050–051; CT-054–057; CT-060–061; CT-063–083 |
| Bloqueado | 4 | CT-010, CT-016, CT-023, CT-058 |
| Não aplicável | 3 | CT-040, CT-059, CT-062 |
| **Total** | **83** | 42 + 4 + 30 + 4 + 3 |

Leitura anterior **40 + 4 + 32 = 76** omitiu Bloqueado e Não aplicável. Etapa 16 moveu CT-052 e CT-053 de mapeado para automatizado. Os sete (4+3) não são “pendentes”.

### Parciais (4)

| ID | Por que não é Automatizado pleno |
|---|---|
| CT-036 | Heading Documentos: live-only; mocked não afirma (sem `/form/documentos`) |
| CT-038 | tipoEspecie no inventário CE/MA/PR/RJ; extra explícito só em MA |
| CT-048 | Trava PR: alerta de residência embutido no fluxo de registro, sem spec própria |
| CT-049 | Trava PB: idem |

### Bloqueados (4)

| ID | Bloqueio |
|---|---|
| CT-010 | Credencial Master — `BLOCKED_SECURITY_CREDENTIAL_ROTATION` |
| CT-016 | `test.fixme` na recuperação 500 |
| CT-023 | Home/menus Master — depende de CT-010 |
| CT-058 | Registro persistente live / DETRAN — política da suíte |

### Não aplicável (3)

| ID | Motivo |
|---|---|
| CT-040 | SE não tem formulário PAGE-02 |
| CT-059 | CE/RO/MA fora da suíte de registro (`DetranUf`); casca estrutural existe |
| CT-062 | SE registro — `test.skip` / `formularioIndisponivel` |

## Por tipo (eixo complementar; um CT pode ter vários rótulos)

Contagem **primária** no CSV (`tipo`, primeiro token) não substitui o status de automação.

- Estrutural / navegação smoke: login UI, home, telas, casca PAGE-02.
- Funcional positivo: login admin, registro feliz 18 UFs.
- Funcional negativo: login e submit sem veículo.
- Integração **aprovada contra sistema externo:** 0. Integração **mockada:** CT-011, CT-053. Integração **mapeada:** B3, DETRAN timeout.

## Ambiente (implementação × evidência)

| Ambiente | Lógicos com implementação | Execução comprovada |
|---|---|---|
| Mocked | 46 (42 + 4 parciais no job mocked) | Local etapa 16: 102 passed / 3 skipped; CI do PR confirma |
| Live-readonly | 21 specs estruturais + gates 0–3 | 19 UFs históricas; **0** no SHA `60afe11` |
| Não definido | mapeados PAGE-03..08 | `NOT_VERIFIED` |

Gates CT-041–CT-044: Automatizado no código, `test.skip` sem flags, `NOT_VERIFIED` neste SHA. Não entram na regressão mocked.

## O que a regressão mocked realmente corre

`playwright-tests.yml` no PR: `--grep-invert @live-readonly` → **102 passed / 3 skipped** (2× SE registro + 1 fixme recuperação) na etapa 16 local. Isso **não** inclui live PAGE-02.

## Distinções obrigatórias

| Declaração | Uso neste inventário |
|---|---|
| Cenário mapeado | Existe intenção documentada (CT no CSV) |
| Cenário automatizado | Spec/helper exerce a intenção |
| Parcialmente automatizado | Intenção coberta só em parte |
| Executado mocked | Run CI comprovado |
| Executado live | Run live comprovado |
| Evidência histórica | Live em SHA ≠ HEAD (19 UFs) |
| Evidência no SHA atual | Live em `60afe11` = **nenhuma** |
| Bloqueado | Impedimento conhecido (segurança, fixme, política) |
| Não aplicável | Produto/suíte não oferece o fluxo |

Não declarar 21/21 live. Não tratar mocked como homologação DETRAN/B3. Não atribuir live a MA/TO.

## Lacuna de automação vs mapeamento

PAGE-03, 04, 05, 06, 07, 08 (imagem por tela): **0 specs**. Home e login estão cobertos. PAGE-02 estrutural 21/21 mocked; funcional registro 18/18 mocked (SE skip; CE/RO/MA intencionalmente fora).
