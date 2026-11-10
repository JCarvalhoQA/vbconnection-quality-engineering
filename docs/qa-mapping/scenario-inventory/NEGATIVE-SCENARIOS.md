# Cenários negativos já mapeados

Não inventa resultado esperado. `RULE_NOT_CONFIRMED` = mencionado sem regra de UI confirmada.

Total no CSV (`positivo_negativo = negativo`): **25**. Polaridade é eixo separado do status de automação.

## Metodologia da contagem (não somar faixas sobrepostas)

O relatório anterior citou:

- 8 com alguma automação
- 1 marcado como `fixme`
- 17 apenas mapeados

Essas faixas **não são exclusivas**. CT-016 entra nos “8 com alguma automação” **e** no “1 fixme”. Somar 8 + 1 + 17 = 26 inflaria o total.

Status **exclusivo** no CSV:

| Status de automação | Qtd | IDs |
|---|---:|---|
| Automatizado | 7 | CT-002, CT-003, CT-004, CT-006, CT-011, CT-014, CT-046 |
| Bloqueado (`test.fixme`) | 1 | CT-016 |
| Apenas mapeado | 17 | CT-050–055, CT-060–061, CT-064, CT-070, CT-072–073, CT-075, CT-077, CT-080–082 |
| **Total negativos** | **25** | |

Leitura equivalente, **não exclusiva**: 8 com artefato de teste (os 7 + CT-016) · 1 fixme (CT-016) · 17 só mapeados.

Nenhum negativo está em Parcialmente automatizado ou Não aplicável.

## Automatizados (mocked, exclusivos)

| ID | Cenário | Onde | Evidência |
|---|---|---|---|
| CT-002 | Login submit vazio | `login.spec.ts` | MOCKED_PASSED 42635151327 |
| CT-003 | Usuário/senha inválidos | `login.spec.ts` | MOCKED_PASSED |
| CT-004 | Bloqueio 5ª tentativa | `login-fluxos.spec.ts` | MOCKED_PASSED |
| CT-006 | Home sem sessão | `login.spec.ts` | MOCKED_PASSED |
| CT-011 | Falha de rede no token | `login-fluxos.spec.ts` | MOCKED_PASSED (mock abort) |
| CT-014 | Recuperação usuário vazio | `login-recuperacao.spec.ts` | MOCKED_PASSED |
| CT-046 | Registrar sem veículo | `validarCamposObrigatorios` × 18 UFs | MOCKED_PASSED |

## Bloqueado (fixme — não somar com a tabela acima)

| ID | Cenário | Onde | Evidência |
|---|---|---|---|
| CT-016 | Recuperação API 500 | `login-recuperacao.spec.ts` | `SKIPPED_FIXME` — UI newfront não atualiza |

## Mapeados, não automatizados (17)

| ID | Tema | Status da regra |
|---|---|---|
| CT-050 | Chassi ≠ 17 | RULE_NOT_CONFIRMED |
| CT-051 | CPF/CNPJ inválido | RULE_NOT_CONFIRMED |
| CT-052 | Data inválida / Enter no datepicker | CONFIRMADO no mapeamento antigo; **sem spec negativa** |
| CT-053 | POST registrar 5xx | RULE_NOT_CONFIRMED (candidato a mock) |
| CT-054 | Timeout DETRAN | RULE_NOT_CONFIRMED |
| CT-055 | Sem permissão CONTRATO_EDITAR | RULE_NOT_CONFIRMED (inferido v2) |
| CT-060 | Chassi duplicado DETRAN | RULE_NOT_CONFIRMED (hipótese explícita) |
| CT-061 | Valores financeiros inconsistentes | RULE_NOT_CONFIRMED |
| CT-064 | Protocolo de aditivo inexistente | CONFIRMADO Gherkin; sem spec |
| CT-070 | Nome de arquivo de lote (espaço/hífen) | código v2; sem spec NX |
| CT-072 | Arquivo vazio no lote | código v2; sem spec NX |
| CT-073 | Extensão zip no lote de contrato | código v2; sem spec NX |
| CT-075 | Nome aditivo lote | RULE_NOT_CONFIRMED NX |
| CT-077 | ZIP/limite imagens lote | CONFIRMADO_CODIGO v2 |
| CT-080 | PDF acima do limite MT (3,5 MB) | CONFIRMADO_CODIGO limites; sem spec |
| CT-081 | PDF acima do limite SC (5 MB) | CONFIRMADO_CODIGO limites; sem spec |
| CT-082 | PDF acima do limite MS (5 MB) | CONFIRMADO_CODIGO limites; sem spec |

## Por tema (um CT em um tema primário)

| Tema | IDs | Qtd |
|---|---|---:|
| Autenticação / sessão | CT-002, CT-003, CT-004, CT-006, CT-014, CT-016 | 6 |
| Campos obrigatórios | CT-046 | 1 |
| Falha HTTP / rede | CT-011, CT-053 | 2 |
| Timeout | CT-054 | 1 |
| Permissões | CT-055 | 1 |
| Chassi | CT-050, CT-060 | 2 |
| Documentos (CPF/CNPJ) | CT-051 | 1 |
| Datas | CT-052 | 1 |
| Valores | CT-061 | 1 |
| Aditivo | CT-064 | 1 |
| Lote / arquivo | CT-070, CT-072, CT-073, CT-075, CT-077 | 5 |
| Regras específicas de UF (limite PDF) | CT-080 MT, CT-081 SC, CT-082 MS | 3 |
| **Total** | | **25** |

CT-011 é falha de rede no token (login), não timeout DETRAN. CT-080–082 são limites de upload por UF, não regras de casca PAGE-02.

## Investigados e **não encontrados** como cenário automatizado

- Perfil sem permissão na Nova UX (além da hipótese CT-055).
- Falha de envio B3 (botão/etapa de form **não** existe em `DadosForm`).
- Falha DETRAN no registro live (proibido / sem spec).
- Gravame como validação negativa (só heading/campos estruturais e telas de relatório CE).

Esta publicação **não cria** specs novas para esses temas.
