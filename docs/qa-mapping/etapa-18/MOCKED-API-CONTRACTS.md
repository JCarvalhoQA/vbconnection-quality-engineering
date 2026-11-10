# Contratos de API mocked — Etapa 18

| Elemento | Método | Rota | Corpo | Sucesso | Erro | Origem | Classe |
|---|---|---|---|---|---|---|---|
| Registrar contrato | POST | `**/contratos/registrar` | JSON/form observado no POST | `{protocolo,status:RECEBIDO}` 200 | `{}` 400/500/503 | `contratoCadastroMocks.ts` + browser | OBSERVED (mock) |
| Payload chassi/número | POST | idem | deve conter strings da massa | — | — | `esperarRegistroFuncional` | OBSERVED |
| B3 enviar | POST | `/api/b3/enviar` | — | — | abort persistGuard | `persistGuard.ts` | DOCUMENTED |
| Imagem upload | POST | `**/imagens/upload` (padrão) | — | — | abort mocked | unit persistGuard | DOCUMENTED |
| Busca imagem | GET | UNKNOWN | — | — | — | VA-1719 sem contrato | UNKNOWN |
| Timeout registrar | — | — | — | — | copy UNKNOWN | Confluence ausente | UNKNOWN |
| 401/403 registrar | — | — | — | — | não documentado | — | UNKNOWN |
| 409 duplicidade | — | — | — | — | não documentado | CT-060 | UNKNOWN |

Não se enviou escrita real. 400/503 reutilizam o mesmo corpo vazio do 500 (etapa 16): **não** há copy de produto.
