# Etapa 9 — Auditoria técnica

Referência: `main` @ `e99ba92a76a471a13d1119590422528444df2f2c`.  
Live baseline: [run 42245037609](https://github.com/JCarvalhoQA/vbconnection-quality-engineering/actions/runs/42245037609) — 7 passed / 0 failed / 0 flaky / 2m 02s (`suite=smoke`, live-readonly).

## Observado

- Specs estruturais na `main`: BA, CE, RO, AC, AP, DF, ES.
- Factory `definirTestesEstruturaisPage02` cobria lote 1; BA/CE/RO seguem specs próprias.
- `persistGuard`, `workers=1`, `retries=0`, Environment `live-readonly` restrito à `main`.
- Relatório do run 42245037609: Total 7, UFs executadas **AC, AP, CE, DF, ES, RO** (BA ausente no texto).

## Causa da ausência de BA

BA **foi executada** (`ba-estrutural.spec.ts` 16.8s, passed). O resumo omitiu a sigla porque `extractUfsFromSpec` lia só `spec.title` + `spec.file` com regex **case-sensitive**.

- Título do teste BA: `valida casca, linha de veículo...` — sem token `BA`.
- Arquivo: `ba-estrutural.spec.ts` — minúsculo, não casa `\bBA\b`.
- O `describe` (`PAGE-02 BA`) não era percorrido.

As demais UFs tinham a sigla no título da factory (`valida casca AC...`).

Efeito colateral: `Lote: smoke` copiava `SUITE` quando `PLAYWRIGHT_UFS` vinha vazio.

## Não observado / não executado nesta auditoria

- Rotação da senha Master (ver `LIVE-SECURITY-AUDIT.md`).
- Live do lote 2.
