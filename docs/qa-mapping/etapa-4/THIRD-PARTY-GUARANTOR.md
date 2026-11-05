# Terceiro garantidor — Nova UX

**Prioridade:** CE  
**Data:** 2026-11-05  
**Persistência:** seção só lida; nenhum campo preenchido; CEP **não** focado (`buscarCep` no template)

## Existência na interface

| UF | Heading live | Java `DADOS_TERCEIRO_GARANTIDOR` | Mock/fixture | Suíte |
|---|---|---|---|---|
| BA | não | `false` | replica | n/a |
| CE | **Terceiro garantidor** | `true` | replica `true` | **não** está na suíte |
| RO | não | `false` | replica `false` | **não** está na suíte |

Condição de visibilidade observada: **apenas o destino**. Após selecionar DETRAN-CE, a seção aparece junto com o restante do form. Não dependeu de tipo de restrição, agente, veículo ou documentos (esses não foram alterados para “esconder” TG).

No front: `*ngIf="contratoEtapa?.terceiroGarantidor"` em `contrato-form.component.html`. Alinhado à flag de etapa do DETRAN, não a um checkbox da PAGE-02.

## Campos CE (live)

Todos **opcionais visuais**. Cidade começa **disabled**.

| Nome | id | `formcontrolname` | Tipo | `*` |
|---|---|---|---|---|
| Código | `terceiroCodigo` | `codigo` | input | não |
| CPF / CNPJ | `terceiroCnpj` | `cnpj` | input | não |
| Nome completo | `terceiroNome` | `nome` | input max 40 | não |
| CEP | `terceiroCep` | `cep` | máscara `00000-000` | não |
| Logradouro | `terceiroLogradouro` | `logradouro` | input | não |
| Número | `terceiroNumero` | `numero` | input | não |
| Complemento | `terceiroComplemento` | `complemento` | input | não |
| Bairro | `terceiroBairro` | `bairro` | input | não |
| UF | `terceiroUf` | `uf` | `nz-select` | não |
| Cidade | `terceiroCidade` | `cidade` | `nz-select` disabled | não |
| Telefone | `terceiroTelefone` | `numero` | máscara telefone | não |
| Celular | `terceiroCelular` | `numero` | máscara telefone | não |

Java CE: todos os campos TG `[true, false]` (visíveis opcionais), inclusive `CODIGO_DETRAN`, `EMAIL`, `TEL_*`, `TEL_CELULAR`. Live **não** mostrou e-mail de TG. Código live mapeia `CODIGO_DETRAN`. Telefone+Celular = um campo cada (não DDD separado).

| Java CE | Live CE | Classe |
|---|---|---|
| Seção visível | sim | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| Nenhum TG obrigatório | 0 `*` | CONFIRMADA_LIVE + CONFIRMADA_JAVA |
| EMAIL visível | **ausente** | INCOMPATÍVEL |
| TEL_DDD + TEL_NUMERO | um Telefone | INCOMPATÍVEL shape |
| Cidade/UF | UF + Cidade (cidade trava) | CONFIRMADA_LIVE |

## Dependências

- UF TG → Cidade (disabled até UF). Exercitar a UF **não** foi feito (evita listas longas; evidência igual ao devedor).
- CEP focusout dispara `buscarCep()` — **BLOQUEADO** para inspeção (efeito de rede; não é POST de contrato, mas sai do “só UI”).
- Nenhum botão “Adicionar garantidor”: o bloco já está no form. Concluir registro com TG vazio: **BLOQUEADO** (exigiria Registrar).

## RO / BA

Não há heading, não há `#terceiro*`. Não inferir campos. Java/fixture já dizem seção falsa.

## Impacto na automação (não executar)

1. Não incluir CE na suíte sem locators `#terceiro*` e regra “TG opcional — vazio não deve falhar o Registrar” (isso só se prova com persistência, hoje BLOQUEADO).
2. POM `selecionarDetran` já procura heading TG se a fixture marcar a seção; isso é compatível com CE **quando** CE existir em `DetranUf`.
3. Não copiar asserts de BA (BA não tem TG).
4. Mock já devolve `form/terceiroGarantidor/detran/` a partir da fixture — não alterar agora.
