# PAGE-02 — Registro de contrato

URL: `/vbconnection/contrato/inserir`  
Live newfront: **BLOQUEADO**. POM + mocks: **CONFIRMADO_TESTE**. Matriz: **CONFIRMADO_CODIGO**.

## Layout real (Nova UX)

Não é o wizard 1→7 do enunciado. Após escolher Destino, o teste espera **ao mesmo tempo** os headings `Agente financeiro` e `Veículos` e o botão `Registrar contrato`. **CONFIRMADO_TESTE** (`ContratoPage.selecionarDetran`).

Seções possíveis segundo `GET /api/form/detran/{id}` (verdadeiro se **algum** campo da seção está visível):

| Seção API | Título UI | UFs sem a seção (matriz) |
|---|---|---|
| agente | Agente financeiro | nenhuma |
| veiculo | Veículo | nenhuma |
| contrato | Contrato | nenhuma |
| devedor | Devedor | nenhuma |
| credor | Credor | nenhuma |
| complementares | Dados complementares | nenhuma |
| terceiro_garantidor | Terceiro garantidor | AC, AP, BA, DF, MG, MS, MT, PB, PE, RN, RO, RR, RS, SC, SP, TO |
| aditivo | Aditivo (matriz de campos) | DF, RJ |

- Envio B3: **não** está em `MatrizFormHelper.DadosForm`. Tratar como **INFERIDO / NÃO_ANALISADO**.
- Terceiro garantidor: visível só se a matriz tiver campo visível (**CE, ES, PR, RJ**).

## Dependências de API (não chamar registrar real)

`GET fornecedores/destinos-combo` · `GET /api/form/detran/{id}` · `GET form/{secao}/detran/{id}` · agentes · tiposContrato · CEP · `POST contratos/registrar` (**interceptar sempre**).

## Validações observadas no POM

- Submit sem veículo: toasts `Pelo menos 1 veículo deve ser informado.` e `Há campos obrigatórios a serem preenchidos.`
- Sucesso mock: `Contrato registrado com sucesso.` + body `status=RECEBIDO`.
- Chassi de massa: 17 caracteres (`ContratoFactory`).
- Número: prefixo `E2E{UF}`.

Não avançar o POST real. Obrigatoriedade visual por UF no newfront = **NÃO CONFIRMADO** até haver sessão.
