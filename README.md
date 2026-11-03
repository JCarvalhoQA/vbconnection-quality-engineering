# Playwright — execução e limites

Consulte [alvos](../../docs/audit/TARGET-DECISIONS.md) e [resultado do lote](../../docs/audit/BATCH-01-EXECUTION.md).

## Runner puro B04-A

Requer Node >=20 e dependências locais compatíveis com package-lock.json já disponíveis. Não requer credencial, browser, app, backend ou Docker. Downloads/instalações não fazem parte deste lote.

Neste diretório, com Node no PATH:

~~~powershell
node node_modules/@playwright/test/cli.js test --config=playwright.unit.config.ts
node node_modules/typescript/bin/tsc --noEmit
~~~

Coleta somente tests/*.test.ts; não carrega dotenv/config runtime e não usa page/browser/request. Trace/vídeo/screenshot desligados. Funções recebem objeto/string sem I/O.

resolveTestTarget recebe { mode?, baseURL, allowedOrigins }. Ausência de mode significa mock; baseURL/allowlist são obrigatórios. Mock só aceita localhost, 127.0.0.1 e [::1] explicitamente listados, com origem exata (protocolo/host/porta). Integração exige mode integration e allowlist; resolver objeto não autoriza nem inicia rede. Credencial na URL, query/fragment na base e path não raiz na origem são recusados com TARGET_*.

assertAllowedUrl verifica URL candidata e retorna URL ou erro. Não intercepta rede. Browser/redirect/worker/WebSocket pertencem a B04-B, ainda não implementado. A política não está ligada ao E2E atual.

## Runner existente

npm test e scripts test:smoke/test:login/test:headed/test:contrato/test:contrato:ba continuam carregando playwright.config.ts, .env e baseURL remoto por padrão. Não usá-los para testar isolamento local. Massas e credenciais não são necessárias ao runner puro e não devem ser compartilhadas.

Não foi criado script npm test:unit. Não iniciar backend hmgvb, HMG, Docker ou instalar browsers por inferência deste guia. Após atualização Git, reproduzir apenas comandos puros; UI exige B01/B03/B04-B e aprovação própria.
