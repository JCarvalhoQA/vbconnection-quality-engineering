# Modernização GitHub Actions

Política de pin: **major tag** das Actions com runtime Node 24. Não usar `@latest`. SHA completo fica como opção futura se o time exigir imutabilidade absoluta.

| Peça | Baseline | Etapa 8 | Motivo |
|---|---|---|---|
| Runner | `ubuntu-latest` | `ubuntu-24.04` | Evitar salto silencioso para Ubuntu 26.04 |
| Node da suíte | 20 | **24** | Alinha ao runtime das Actions v5/v6; Playwright ^1.55 compatível |
| `engines` npm | `>=20` | `>=20` (sem restringir devs em 20) | CI usa 24 |
| checkout | v4 (Node 20) | **v5** (Node 24) | Warning de depreciação |
| setup-node | v4 | **v5** + `cache: npm` | Node 24; cache explícito (sem `packageManager` no package.json, sem auto-cache v5) |
| upload-artifact | v4 | **v6** | v5 ainda default Node 20; v6 é Node 24 |
| Live workers | 1 | 1 | Sem mudança |
| Live retries | 0 | 0 | Sem mudança |
| Concorrência live | cancelava | **enfileira** | Não perder diagnóstico |
| Retenção artifact live | 14d | **7d** | Menos exposição |
| Input `ufs` | inexistente | opcional, só `structural` | Baseline vs lote 1 |

Não migrado: Playwright 1.55 (upgrade amplo desnecessário), `setup-node@v6/v7` (breaking de cache/auth).

`ubuntu-26.04` fica para avaliação depois que o lote 1 live passar neste runner 24.04.
