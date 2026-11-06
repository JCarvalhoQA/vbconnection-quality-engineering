# Análise do teste flaky — VA-1774

**Execução com flaky:** [PR #3 mocked](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42086142737) · artifact `playwright-42086142737-mocked-regression`  
**A rerun `42074098852` attempt 2** passou sem flaky (80 passed). A evidência do retry está no JSON do PR #3.

## Identificação

| Campo | Valor |
|---|---|
| Arquivo | `e2e/home/atalho-registro-contrato.spec.ts` |
| Título | `VA-1774 abre o formulário de registro a partir da home` |
| Status Playwright | `flaky` (1ª tentativa failed, 2ª passed) |
| Duração 1ª | 20,7s |
| Duração 2ª | 8,2s |

## Primeira falha

```text
expect(page).toHaveURL(/\/vbconnection\/contrato\/inserir/)
Received: https://newfront.vbconnection.info/vbconnection/home
Timeout: 15000ms
```

O snapshot de acessibilidade **depois** do timeout ainda mostra a home completa, com o botão `Registro de Contrato` visível. Screenshot `test-failed-1.png`: nenhum overlay Blip, nenhum spinner, atalho visível.

## Causa-raiz

O spec fazia `atalho.click({ force: true })` imediatamente após o heading “Atividades mais frequentes”.

`force: true` ignora as checagens de actionability (elemento estável e capaz de receber eventos). O `gotoApp` já documentava o mesmo fenômeno: *pushState antes de o router Angular terminar a navegação inicial para `/vbconnection/home` era sobrescrito*.

Sequência:

1. `home.acessar()` carrega `/` e empurra `/vbconnection/home` no cliente.
2. O heading da home aparece **antes** do `(click)`/`routerLink` do atalho estar ligado.
3. O clique forçado não dispara a navegação SPA; a URL permanece em `/home` por 15s.
4. No retry o shell já assentou; o clique funciona em ~8s.

Não é dependência entre testes, nem mock ausente: `mockHomeApis` + `mockContratoCadastroApis` estavam instalados. Não é overlay Blip no instante da captura (o hide CSS já rodava, mas o `force` tornava isso irrelevante).

Classificação de sintoma: **falha de sincronização** (SPA), não defeito de produto.

## Correção

- Removido `click({ force: true })`.
- `HomePage.abrirAtalho` espera o shell autenticado idle (`waitForAuthenticatedShellIdle`), clica sem force e só reitera o clique se a URL **não** mudou — o mesmo padrão observável de `gotoApp`, sem `waitForTimeout`.

## Estabilidade

```text
npx playwright test e2e/home/atalho-registro-contrato.spec.ts --repeat-each=10 --retries=0 --workers=1
10 passed (1.0m)
```

Na regressão mockada local completa (`--retries=0`): VA-1774 passou na primeira tentativa.
