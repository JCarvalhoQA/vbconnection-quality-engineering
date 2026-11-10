# Auditoria técnica — Etapa 18

**Main:** `4ff36988a42a30b06374a3acd66fefd44689ea00` (PR #17). PR #18 (Etapa 17) permanece aberto, não mergeado.
**Knowledge MCP `vbauto`:** `NO_KEY` — RAG indisponível.
**Confluence:** space VA (`qualitydigital.atlassian.net/wiki/spaces/VA`) acessível.

## Fontes recuperadas

| Fonte | ID | Uso |
|---|---|---|
| Confluence | [Registro de Contrato e Aditivo por Tela](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2088435715) | Fluxo Agente→…→Complementares; CT001–CT018 do espaço VA |
| Confluence | [DETRAN-BA](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2106490952) | Gravame 8 dígitos; anos ±1; parcelas/financiamento sem negativo; datas |
| Confluence | [Imagem de contrato](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2130214940) | Upload/download/excluir com protocolo real — **não reutilizado** |
| Confluence | [Perfil de usuário](https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2148532238) | OPERADOR / OPERADOR DE IMAGEM |
| Jira | [VA-1719](https://qualitydigital.atlassian.net/browse/VA-1719) | Tela NX “Registrar imagem por tela”; campos **não detalhados** |
| Jira | [VA-1718](https://qualitydigital.atlassian.net/browse/VA-1718) | Imagem em lote; formato **não detalhado** |
| Jira | VA-1774 | Atalho Registro de Contrato (já automatizado) |

## Páginas Confluence não detalhadas nesta etapa

DETRAN-AC, AP, MG, MS (mesmo template de BA; não generalizados). Manuais B3. CT017/CT018 B3 — persistGuard aborta `/api/b3/enviar`.

## Sonda NX mocked (sem credencial Master)

| Observação | Resultado | Classe |
|---|---|---|
| Gravame `maxlength=8`; fill 9 dígitos → valor 8 | `CONFIRMED_BY_UI` | CT-084 |
| Parcelas `-5` → `5` | `CONFIRMED_BY_UI` | CT-085 |
| Rotas PAGE-07/08 via `gotoApp` | Home (“Página Inicial”), `input[type=file]=0` | `CONFIRMED_BY_UI` |
| Atalho “Imagem de Contrato” | visível; não abre upload | `CONFIRMED_BY_UI` |
| Menu Funcionalidades | vbDETRANS / vbPAGUE / vbHUB | `CONFIRMED_BY_UI` |

## Divergências Confluence × NX

| Regra Confluence | NX observada | Decisão |
|---|---|---|
| Gravame >8 dígitos exibe mensagem de erro | Trunca; sem copy | Automatizar truncagem; não inventar copy |
| Chassi “inválido segundo as normas” | Sem definição de norma nem rejeição I/O/Q | CT-050 permanece `RULE_NOT_CONFIRMED` |
| Datas 1ª/última parcela | Copy não encontrada no DOM | Não automatizar CT-087/088 |
| Ano fabricação ±1 | Não sondado até salvar veículo completo | Não criar CT |
| Upload imagem por protocolo | Tela não monta | Não automatizar CT-078–083 |
